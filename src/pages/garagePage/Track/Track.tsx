import { Car } from '../Car/Car';
import styles from './Track.styles.css';

type TrackProps = {
  name: string;
  color: string;
  id: number;
  onDelete: (id: number) => void;
  onSelect: () => void;
};

export const Track = ({ name, color, id, onDelete, onSelect }: TrackProps): JSX.Element => {
  return (
    <>
      <section>
        <div className={styles.carContainer}>
          <div className={styles.controls}>
            <button className={styles.selectBtn} onClick={onSelect}>
              Select
            </button>
            <button className={styles.removeBtn} onClick={() => onDelete(id)}>
              Remove
            </button>
            <div className={styles.name}>{name}</div>
          </div>
          <div className={styles.road}>
            <button className={styles.startBtn}>A</button>
            <button className={`${styles.stopBtn} ${styles.inactiveBtn}`} disabled>
              B
            </button>
            <Car color={color}></Car>
          </div>
        </div>
      </section>
    </>
  );
};
