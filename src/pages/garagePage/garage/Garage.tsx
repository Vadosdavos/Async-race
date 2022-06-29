import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deleteCar,
  getCars,
  ICar,
  ICarSet,
  setCar,
  stopEngine,
  updateCar,
  driveMode,
  startEngine,
  IWinnerData,
  setWinner,
  updateWinner,
  getWinner,
  deleteWinner,
} from "../../../api/api";
import { generateRandomCars } from "../../../api/utils";
import { LoadingBar } from "../../../components/LoadingBar/LoadingBar";
import { FormField } from "../FormField/FormField";
import { Track } from "../Track/Track";
import { WinModal } from "../WinModal/WinModal";
import styles from "./Garage.styles.css";

const CAR_MARGIN = 180 + document.documentElement.clientWidth * 0.05;

export const Garage = (): JSX.Element => {
  const [carNumber, setCarNumber] = useState(0);
  const [carsArray, setCarsArray] = useState<ICar[]>([]);
  const tempCarData: ICarSet = useMemo(() => {
    return { name: "testCar", color: "#ffffff" };
  }, []);
  const updateInputRef = useRef<HTMLInputElement>(null);
  const [colorUpdateValue, setColorUpdateValue] = useState("#000000");
  const [tempCarId, setTempCarId] = useState(0);
  const [page, setPage] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [winnerData, setWinnerData] = useState({
    id: 0,
    name: "No one",
    time: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRaceActive, setIsRaceActive] = useState(false);
  const [isLoadActive, setIsLoadActive] = useState(false);
  const refsArray: Array<React.RefObject<HTMLDivElement>> = useMemo(
    () => [],
    []
  );
  const raceDistance = document.documentElement.clientWidth - CAR_MARGIN;

  async function getGarageState(curPage: number): Promise<void> {
    setIsLoadActive(true);
    const { count: carCount, items: cars } = await getCars(curPage);
    if (carCount) {
      setCarNumber(+carCount);
    }
    if (cars) {
      setCarsArray(cars);
    }
    setIsLoadActive(false);
  }

  useEffect(() => {
    getGarageState(page);
  }, [page]);

  for (let i = 0; i < 7; i += 1) {
    const element = useRef<HTMLDivElement>(null);
    refsArray.push(element);
  }

  const handleDelete = useCallback(
    (id: number): void => {
      deleteCar(id);
      deleteWinner(id);
      setCarNumber((prevCarNumber) => prevCarNumber - 1);
      const index = carsArray.findIndex((el) => el.id === id);
      setCarsArray((prevCarsArray) => [
        ...prevCarsArray.slice(0, index),
        ...prevCarsArray.slice(index + 1),
      ]);
      if (carsArray.length === 1) {
        setPage((prevValue) => prevValue - 1);
      }
    },
    [carsArray]
  );

  const handleTextInput = useCallback(
    (event: SyntheticEvent): void => {
      const target = event.currentTarget as HTMLInputElement;
      tempCarData.name = target.value;
    },
    [tempCarData]
  );

  const handleColorInput = useCallback(
    (event: SyntheticEvent): void => {
      const target = event.currentTarget as HTMLInputElement;
      tempCarData.color = target.value;
    },
    [tempCarData]
  );

  const handleCreateClick = useCallback((): void => {
    const res = setCar({
      name: tempCarData.name,
      color: tempCarData.color,
    });
    if (carsArray.length < 7) {
      res.then((data: ICar) =>
        setCarsArray((prevCarsArray) => [...prevCarsArray, data])
      );
    }
    setCarNumber((prevCarNumber) => prevCarNumber + 1);
  }, [tempCarData, carsArray]);

  const handleUpdateClick = useCallback((): void => {
    const updateInputText = updateInputRef.current as HTMLInputElement;
    const newName = updateInputText.value;
    const newColor = tempCarData.color ? tempCarData.color : colorUpdateValue;
    updateCar(tempCarId, {
      name: newName,
      color: newColor,
    });
    const index = carsArray.findIndex((el) => el.id === tempCarId);
    setCarsArray((prevCarsArray) => {
      const newArr = [...prevCarsArray];
      newArr[index].name = newName;
      newArr[index].color = newColor;
      return newArr;
    });
    updateInputText.disabled = true;
    updateInputText.value = "";
  }, [updateInputRef, tempCarData, carsArray, colorUpdateValue, tempCarId]);

  const handleSelect = useCallback(
    (carProps: ICar): void => {
      const updateInputText = updateInputRef.current as HTMLInputElement;
      updateInputText.focus();
      updateInputText.disabled = false;
      updateInputText.value = carProps.name;
      setColorUpdateValue(carProps.color);
      setTempCarId(carProps.id);
    },
    [updateInputRef]
  );

  const handleGenerateCars = useCallback((): void => {
    setIsLoadActive(true);
    Promise.allSettled(generateRandomCars().map((el) => setCar(el))).then(
      () => {
        getGarageState(page);
        setIsLoadActive(false);
      }
    );
  }, [page, setIsLoadActive]);

  const handleChangePage = useCallback((event: SyntheticEvent): void => {
    setIsModalVisible(false);
    setIsRaceActive(false);
    const target = event.target as HTMLElement;
    switch (target.textContent) {
      case "next":
        setPage((prevValue) => prevValue + 1);
        break;
      case "prev":
        setPage((prevValue) => prevValue - 1);
        break;
      default:
        setPage(1);
    }
  }, []);

  const handleResetClick = useCallback((): void => {
    setIsRaceActive((prev) => !prev);
    setIsReset(true);
    carsArray.forEach((el) => stopEngine(el.id));
    setTimeout(() => {
      setIsReset(false);
    }, 0);
    setWinnerData({ id: 0, name: "", time: 0 });
    setIsModalVisible(false);
  }, [carsArray]);

  const move: {
    carAnim: { [key: string]: number };
    anim: (
      duration: number,
      start: number,
      target: HTMLDivElement,
      carProps: ICar
    ) => void;
    start: (carProps: ICar, target: HTMLDivElement) => Promise<IWinnerData>;
    stop: (carProps: ICar, target: HTMLDivElement) => void;
  } = {
    carAnim: {},
    anim: (
      duration: number,
      start: number,
      target: HTMLDivElement,
      carProps: ICar
    ): void => {
      const element = target;
      let timeFraction = (performance.now() - start) / duration;
      if (timeFraction > 1) {
        timeFraction = 1;
      }
      element.style.transform = `translateX(${timeFraction * raceDistance}px)`;
      if (timeFraction < 1) {
        move.carAnim[carProps.id] = requestAnimationFrame(() =>
          move.anim(duration, start, target, carProps)
        );
      }
    },
    start: (carProps: ICar, target: HTMLDivElement): Promise<IWinnerData> => {
      return new Promise((resolve, reject) => {
        startEngine(carProps.id).then(
          ({ distance, velocity }: { distance: number; velocity: number }) => {
            const time = distance / velocity;
            const start = performance.now();
            move.carAnim[carProps.id] = requestAnimationFrame(() => {
              move.anim(time, start, target, carProps);
            });
            driveMode(carProps.id).then((res) => {
              if (!res.success) {
                cancelAnimationFrame(move.carAnim[carProps.id]);
                reject(
                  new Error(`The engine has stopped Car name: ${carProps.name}`)
                );
              } else {
                resolve({
                  id: carProps.id,
                  name: carProps.name,
                  time: Number((time / 1000).toFixed(2)),
                });
              }
            });
          }
        );
      });
    },
    stop: (carProps: ICar, target: HTMLDivElement): void => {
      stopEngine(carProps.id).then(() => {
        cancelAnimationFrame(move.carAnim[carProps.id]);
        const element = target;
        element.style.transform = `translateX(0)`;
      });
    },
  };

  const handleRaceClick = useCallback((): void => {
    setIsRaceActive((prev) => !prev);
    const promisesArr: Promise<IWinnerData>[] = [];
    refsArray.forEach((el, index) =>
      el.current
        ? promisesArr.push(move.start(carsArray[index], el.current))
        : null
    );
    Promise.any(promisesArr)
      .then((data) => {
        if (data) {
          setWinnerData(data);
          getWinner(data.id).then((response) => {
            if (Object.keys(response).length === 0) {
              setWinner({ id: data.id, wins: 1, time: data.time });
            } else {
              updateWinner(response.id, {
                wins: response.wins + 1,
                time: data.time < response.time ? data.time : response.time,
              });
            }
          });
        }
        setIsModalVisible(true);
      })
      .catch(Error);
  }, [refsArray, carsArray, move]);

  return (
    <>
      <section className={styles.controls}>
        <FormField
          type="create"
          handleTextInput={handleTextInput}
          handleColorInput={handleColorInput}
          handleClick={handleCreateClick}
          ref={undefined}
        />
        <FormField
          type="update"
          handleTextInput={handleTextInput}
          handleColorInput={handleColorInput}
          handleClick={handleUpdateClick}
          ref={updateInputRef}
          colorUpdateValue={colorUpdateValue}
        />
        <button
          className={styles.controlsBtn}
          onClick={handleRaceClick}
          disabled={isRaceActive}
        >
          Race
        </button>
        <button
          className={styles.controlsBtn}
          onClick={handleResetClick}
          disabled={!isRaceActive}
        >
          Reset
        </button>
        <button
          className={styles.controlsBtn}
          onClick={handleGenerateCars}
          disabled={isLoadActive}
        >
          Generate cars
        </button>
      </section>
      <h2 className={styles.title}>
        Garage <span>({carNumber})</span>
      </h2>
      <p>Page #{page}</p>
      <section className={styles.tracksContainer}>
        {isLoadActive && <LoadingBar />}
        {carsArray.length > 0 &&
          !isReset &&
          carsArray.map((el, index) => (
            <Track
              key={el.id}
              name={el.name}
              color={el.color}
              id={el.id}
              onDelete={handleDelete}
              onSelect={handleSelect}
              ref={refsArray[index]}
              move={move}
              isRaceActive={isRaceActive}
            />
          ))}
      </section>
      <div>
        <button onClick={handleChangePage} disabled={page <= 1}>
          prev
        </button>
        <button
          className={styles.paginationBtn}
          onClick={handleChangePage}
          disabled={carNumber / 7 <= page}
        >
          next
        </button>
        {isModalVisible && (
          <WinModal>
            {winnerData.name} won first ({winnerData.time})!
          </WinModal>
        )}
      </div>
    </>
  );
};
