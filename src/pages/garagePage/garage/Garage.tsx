import { SyntheticEvent, useEffect, useRef, useState } from 'react';
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
} from '../../../api/api';
import { generateRandomCars } from '../../../api/utils';
import { FormField } from '../FormField/FormField';
import { Track } from '../Track/Track';
import { WinModal } from '../WinModal/WinModal';
import styles from './Garage.styles.css';

const CAR_MARGIN = 180 + document.documentElement.clientWidth * 0.05;

export const Garage = (): JSX.Element => {
  const [carNumber, setCarNumber] = useState(0);
  const [carsArray, setCarsArray] = useState<ICar[]>([]);
  const tempCarData: ICarSet = { name: 'testCar', color: '#ffffff' };
  const updateInputRef = useRef<HTMLInputElement>(null);
  const [colorUpdateValue, setColorUpdateValue] = useState('#000000');
  const [tempCarId, setTempCarId] = useState(0);
  const [page, setPage] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [winnerData, setWinnerData] = useState({ id: 0, name: '', time: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRaceActive, setIsRaceActive] = useState(false);
  const refsArray: Array<React.RefObject<HTMLDivElement>> = [];
  const raceDistance = document.documentElement.clientWidth - CAR_MARGIN;

  let carAnimation = 0;

  async function getGarageState(page: number): Promise<void> {
    const { count: carCount, items: cars } = await getCars(page);
    if (carCount) {
      setCarNumber(+carCount);
    }
    if (cars) {
      setCarsArray(cars);
    }
  }

  useEffect(() => {
    getGarageState(page);
  }, [page]);

  for (let i = 0; i < 7; i++) {
    const element = useRef<HTMLDivElement>(null);
    refsArray.push(element);
  }

  const handleDelete = (id: number) => {
    deleteCar(id);
    setCarNumber((prevCarNumber) => prevCarNumber - 1);
    const index = carsArray.findIndex((el) => el.id === id);
    setCarsArray((prevCarsArray) => [...prevCarsArray.slice(0, index), ...prevCarsArray.slice(index + 1)]);
    if (carsArray.length === 1) {
      setPage((prevValue) => prevValue - 1);
    }
  };
  const handleTextInput = (event: SyntheticEvent) => {
    const target = event.currentTarget as HTMLInputElement;
    tempCarData.name = target.value;
  };
  const handleColorInput = (event: SyntheticEvent) => {
    const target = event.currentTarget as HTMLInputElement;
    tempCarData.color = target.value;
  };
  const handleCreateClick = () => {
    const res = setCar({
      name: tempCarData.name,
      color: tempCarData.color,
    });
    if (carsArray.length < 7) {
      res.then((data: ICar) => setCarsArray((prevCarsArray) => [...prevCarsArray, data]));
    }
    setCarNumber((prevCarNumber) => prevCarNumber + 1);
  };
  const handleUpdateClick = () => {
    updateCar(tempCarId, {
      name: tempCarData.name,
      color: tempCarData.color ? tempCarData.color : colorUpdateValue,
    });
    const index = carsArray.findIndex((el) => el.id === tempCarId);
    setCarsArray((prevCarsArray) => {
      prevCarsArray[index].name = tempCarData.name;
      prevCarsArray[index].color = tempCarData.color;
      return [...prevCarsArray];
    });
    const updateInputText = updateInputRef.current as HTMLInputElement;
    updateInputText.disabled = true;
    updateInputText.value = '';
  };
  const handleSelect = (carProps: ICar) => {
    const updateInputText = updateInputRef.current as HTMLInputElement;
    updateInputText.focus();
    updateInputText.disabled = false;
    updateInputText.value = carProps.name;
    setColorUpdateValue(carProps.color);
    setTempCarId(carProps.id);
  };
  const handleGenerateCars = () => {
    generateRandomCars().forEach((el) => setCar(el));
    getGarageState(page);
  };
  const handleChangePage = (event: SyntheticEvent) => {
    setIsModalVisible(false);
    setIsRaceActive(false);
    const target = event.target as HTMLElement;
    switch (target.textContent) {
      case 'next':
        setPage((prevValue) => prevValue + 1);
        break;
      case 'prev':
        setPage((prevValue) => prevValue - 1);
        break;
    }
  };

  const handleResetClick = () => {
    setIsRaceActive((prev) => !prev);
    setIsReset(true);
    carsArray.forEach((el) => stopEngine(el.id));
    setTimeout(() => {
      setIsReset(false);
    }, 0);
    carAnimation = 0;
    setWinnerData({ id: 0, name: '', time: 0 });
    setIsModalVisible(false);
  };

  const handleRaceClick = () => {
    setIsRaceActive((prev) => !prev);
    const promisesArr = refsArray
      .map((el, index) => (el.current ? handleStartClick(carsArray[index], el.current) : null))
      .filter((el) => el !== null);
    Promise.any(promisesArr).then((data: IWinnerData | null) => {
      if (data) {
        setWinnerData(data);
        setWinner({ id: data.id, wins: 1, time: data.time }).catch(() => {
          getWinner(data.id).then((response) =>
            updateWinner(response.id, {
              wins: response.wins + 1,
              time: data.time < response.time ? data.time : response.time,
            })
          );
        });
      }
      setIsModalVisible(true);
    });
  };

  const animate = (duration: number, start: number, target: HTMLDivElement) => {
    let timeFraction = (performance.now() - start) / duration;
    if (timeFraction > 1) {
      timeFraction = 1;
    }
    if (target) {
      target.style.transform = `translateX(${timeFraction * raceDistance}px)`;
    }

    if (timeFraction < 1) {
      carAnimation = requestAnimationFrame(() => animate(duration, start, target));
    }
  };

  const handleStartClick = (carProps: ICar, target: HTMLDivElement): Promise<IWinnerData> => {
    return new Promise((resolve, reject) => {
      startEngine(carProps.id).then(({ distance, velocity }: { distance: number; velocity: number }) => {
        const time = distance / velocity;
        const start = performance.now();
        carAnimation = requestAnimationFrame(() => {
          animate(time, start, target);
        });
        driveMode(carProps.id).then((res) => {
          if (!res.success) {
            cancelAnimationFrame(carAnimation);
            reject(new Error('The engine has stopped'));
          } else {
            resolve({
              id: carProps.id,
              name: carProps.name,
              time: Number((time / 1000).toFixed(2)),
            });
          }
        });
      });
    });
  };

  const handleStopClick = (carProps: ICar, target: HTMLDivElement): void => {
    stopEngine(carProps.id).then(() => {
      cancelAnimationFrame(carAnimation);
      target ? (target.style.transform = `translateX(0)`) : null;
    });
  };

  return (
    <>
      <section className={styles.controls}>
        <FormField
          type='create'
          handleTextInput={handleTextInput}
          handleColorInput={handleColorInput}
          handleClick={handleCreateClick}
          ref={undefined}
        />
        <FormField
          type='update'
          handleTextInput={handleTextInput}
          handleColorInput={handleColorInput}
          handleClick={handleUpdateClick}
          ref={updateInputRef}
          colorUpdateValue={colorUpdateValue}
        />
        <button className={styles.controlsBtn} onClick={handleRaceClick} disabled={isRaceActive}>
          Race
        </button>
        <button className={styles.controlsBtn} onClick={handleResetClick} disabled={!isRaceActive}>
          Reset
        </button>
        <button className={styles.controlsBtn} onClick={handleGenerateCars}>
          Generate cars
        </button>
      </section>
      <h2 className={styles.title}>
        Garage <span>({carNumber})</span>
      </h2>
      <p>Page #{page}</p>
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
            onStart={handleStartClick}
            onStop={handleStopClick}
            ref={refsArray[index]}
          />
        ))}
      <div>
        <button onClick={handleChangePage} disabled={page <= 1 ? true : false}>
          prev
        </button>
        <button
          className={styles.paginationBtn}
          onClick={handleChangePage}
          disabled={carNumber / 7 <= page ? true : false}
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
