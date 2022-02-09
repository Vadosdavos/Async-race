import { useEffect, useState } from 'react';
import { deleteCar, getCars, ICar } from '../../../api/api';
import { FormField } from '../FormField/FormField';
import { Track } from '../Track/Track';
import styles from './Garage.styles.css';

export const Garage = (): JSX.Element => {
  const [carNumber, setCarNumber] = useState(0);
  const [carsArray, setCarsArray] = useState<ICar[]>([]);

  async function getGarageState(): Promise<void> {
    const { count: carCount, items: cars } = await getCars(1);
    if (carCount) setCarNumber(+carCount);
    if (cars) setCarsArray(cars);
  }
  useEffect(() => {
    getGarageState();
  }, [carNumber]);

  const handleRemove = (id: number) => {
    deleteCar(id);
    setCarNumber(carNumber - 1);
  };

  return (
    <>
      <section className={styles.controls}>
        <FormField type='create' />
        <FormField type='update' />
        <button className={styles.controlsBtn}>Race</button>
        <button className={styles.controlsBtn}>Reset</button>
        <button className={styles.controlsBtn}>Generate cars</button>
      </section>
      <h2>
        Garage <span>({carNumber})</span>
      </h2>
      <p>Page #1</p>
      {carsArray.length > 0 &&
        carsArray.map((el) => <Track key={el.id} name={el.name} color={el.color} id={el.id} onDelete={handleRemove} />)}
      <div>
        <button>prev</button>
        <button>next</button>
      </div>
    </>
  );
};
