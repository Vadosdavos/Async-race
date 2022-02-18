import { useRef, useState } from 'react';
import { driveMode, ICar, startEngine, stopEngine } from '../../../api/api';
import styles from './Track.styles.css';
import { CarImg } from '../../../components/CarImg/CatImg';

type TrackProps = {
  name: string;
  color: string;
  id: number;
  onDelete: (id: number) => void;
  onSelect: (carProps: ICar) => void;
  onStart: (carProps: ICar, carRef: HTMLDivElement) => void;
  onStop: (carProps: ICar, carRef: HTMLDivElement) => void;
};

export const Track = ({ name, color, id, onDelete, onSelect, onStart, onStop }: TrackProps): JSX.Element => {
  const carRef = useRef<HTMLDivElement>(null);
  const [isCarStarted, setIsCarStarted] = useState(false);

  return (
    <>
      <section>
        <div className={styles.carContainer}>
          <div className={styles.controls}>
            <button className={styles.selectBtn} onClick={() => onSelect({ name, color, id })}>
              Select
            </button>
            <button className={styles.removeBtn} onClick={() => onDelete(id)}>
              Remove
            </button>
            <div className={styles.name}>{name}</div>
          </div>
          <div className={styles.road}>
            <button
              className={`${styles.startBtn} ${isCarStarted && styles.inactiveBtn}`}
              onClick={() => {
                onStart({ name, color, id }, carRef.current as HTMLDivElement);
                setIsCarStarted(true);
              }}
              disabled={isCarStarted}
            >
              A
            </button>
            <button
              className={`${styles.stopBtn} ${!isCarStarted && styles.inactiveBtn}`}
              onClick={() => {
                onStop({ name, color, id }, carRef.current as HTMLDivElement);
                setIsCarStarted(false);
              }}
              disabled={!isCarStarted}
            >
              B
            </button>
            <div ref={carRef} className={styles.car}>
              <CarImg color={color} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
