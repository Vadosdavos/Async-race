import { SyntheticEvent, useEffect, useState } from 'react';
import { deleteCar, getCars, ICar, ICarSet, setCar } from '../../../api/api';
import { FormField } from '../FormField/FormField';
import { Track } from '../Track/Track';
import styles from './Garage.styles.css';

export const Garage = (): JSX.Element => {
  const [carNumber, setCarNumber] = useState(0);
  const [carsArray, setCarsArray] = useState<ICar[]>([]);
  const tempCarData: ICarSet = { name: '', color: '' };

  async function getGarageState(): Promise<void> {
    const { count: carCount, items: cars } = await getCars(1);
    if (carCount) {
      setCarNumber(+carCount);
    }
    if (cars) setCarsArray(cars);
  }

  useEffect(() => {
    getGarageState();
  }, []);

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
    res.then((data: ICar) => setCarsArray((prevCarsArray) => [...prevCarsArray, data]));
    setCarNumber((prevCarNumber) => prevCarNumber + 1);
  };
  const handleUpdateClick = () => {
    console.log('update car click');
  };
  const handleSelect = () => {
    console.log('select');
  };

  return (
    <>
      <section className={styles.controls}>
        <FormField
          type='create'
          handleTextInput={handleTextInput}
          handleColorInput={handleColorInput}
          handleClick={handleCreateClick}
        />
        <FormField
          type='update'
          handleTextInput={handleTextInput}
          handleColorInput={handleColorInput}
          handleClick={handleUpdateClick}
        />
        <button className={styles.controlsBtn}>Race</button>
        <button className={styles.controlsBtn}>Reset</button>
        <button className={styles.controlsBtn}>Generate cars</button>
      </section>
      <h2>
        Garage <span>({carNumber})</span>
      </h2>
      <p>Page #1</p>
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
        <button>prev</button>
        <button>next</button>
      </div>
    </>
  );
};
