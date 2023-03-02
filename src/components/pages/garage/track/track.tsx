import { useState, forwardRef, useEffect } from 'react';
import { ICar, IMove } from '@/utils/api/api';
import { CarImg } from '@/components/carImg/catImg';
import styles from './track.module.css';

type TrackProps = {
  name: string;
  color: string;
  id: number;
  onDelete: (id: number) => void;
  onSelect: (carProps: ICar) => void;
  move: IMove;
  isRaceActive: boolean;
};

export const Track = forwardRef<HTMLDivElement, TrackProps>((
  {
    name, color, id, onDelete, onSelect, move, isRaceActive,
  }: TrackProps,
  ref,
): JSX.Element => {
  const carRef = ref as React.RefObject<HTMLDivElement>;
  const [isCarStarted, setIsCarStarted] = useState(false);

  useEffect(() => {
    setIsCarStarted(isRaceActive);
  }, [isRaceActive]);

  return (
    <div className={styles.carContainer}>
      <div className={styles.controls}>
        <button
          className={styles.selectBtn}
          onClick={() => onSelect({ name, color, id })}
        >
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
            move.start({ name, color, id }, carRef.current as HTMLDivElement);
            setIsCarStarted(true);
          }}
          disabled={isCarStarted}
        >
          A
        </button>
        <button
          className={`${styles.stopBtn} ${!isCarStarted && styles.inactiveBtn}`}
          onClick={() => {
            move.stop({ name, color, id }, carRef.current as HTMLDivElement);
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
  );
});
