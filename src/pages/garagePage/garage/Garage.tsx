import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { deleteCar, getCars, ICar, ICarSet, setCar, updateCar } from '../../../api/api';
import { generateRandomCars } from '../../../api/utils';
import { FormField } from '../FormField/FormField';
import { Track } from '../Track/Track';
import styles from './Garage.styles.css';

export const Garage = (): JSX.Element => {
  const [carNumber, setCarNumber] = useState(0);
  const [carsArray, setCarsArray] = useState<ICar[]>([]);
  const tempCarData: ICarSet = { name: 'testCar', color: '#ffffff' };
  const updateInputRef = useRef<HTMLInputElement>(null);
  const [colorUpdateValue, setColorUpdateValue] = useState('#000000');
  const [tempCarId, setTempCarId] = useState(0);
  const [page, setPage] = useState(1);

  async function getGarageState(page: number): Promise<void> {
    const { count: carCount, items: cars } = await getCars(page);
    if (carCount) {
      setCarNumber(+carCount);
    }
    if (cars) setCarsArray(cars);
  }

  useEffect(() => {
    getGarageState(page);
  }, [page]);

  const handleDelete = (id: number) => {
    deleteCar(id);
    setCarNumber((prevCarNumber) => prevCarNumber - 1);
    const index = carsArray.findIndex((el) => el.id === id);
    setCarsArray((prevCarsArray) => [...prevCarsArray.slice(0, index), ...prevCarsArray.slice(index + 1)]);
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
        <button className={styles.controlsBtn}>Race</button>
        <button className={styles.controlsBtn}>Reset</button>
        <button className={styles.controlsBtn} onClick={handleGenerateCars}>
          Generate cars
        </button>
      </section>
      <h2 className={styles.title}>
        Garage <span>({carNumber})</span>
      </h2>
      <p>Page #{page}</p>
      {carsArray.length > 0 &&
        carsArray.map((el) => (
          <Track
            key={el.id}
            name={el.name}
            color={el.color}
            id={el.id}
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        ))}
      <div>
        <button onClick={handleChangePage} disabled={page <= 1 ? true : false}>
          prev
        </button>
        <button
          className={styles.paginationBtn}
          onClick={handleChangePage}
          disabled={carsArray.length < 7 || carNumber <= 7 ? true : false}
        >
          next
        </button>
      </div>
    </>
  );
};
