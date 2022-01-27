import { getCars } from '../../../api/api';
import { FormField } from '../FormField/FormField';
import { Track } from '../Track/Track';
import styles from './Garage.styles.css';

export const Garage = () => {
  async function getCarsAmountInGarage() {
    const data = await getCars(1);
    return data.items.length;
  }

  const renderCars = async () => {
    const num = await getCarsAmountInGarage();
    console.log(num);
    return new Array(num).fill(num).map(() => <Track />);
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
        Garage <span>(0)</span>
      </h2>
      <Track />
      <div>
        <button>prev</button>
        <button>next</button>
      </div>
    </>
  );
};
