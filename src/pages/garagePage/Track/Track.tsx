import { useRef } from 'react';
import { driveMode, ICar, startEngine } from '../../../api/api';
import styles from './Track.styles.css';
import { CarImg } from '../../../components/CarImg/CatImg';

type TrackProps = {
  name: string;
  color: string;
  id: number;
  onDelete: (id: number) => void;
  onSelect: (carProps: ICar) => void;
};

interface IAnimate {
  duration: number;
  draw: (progress: number) => void;
}

const CAR_MARGIN = 180 + document.documentElement.clientWidth * 0.05;

export const Track = ({ name, color, id, onDelete, onSelect }: TrackProps): JSX.Element => {
  const carRef = useRef<HTMLInputElement>(null);
  const raceDistance = document.documentElement.clientWidth - CAR_MARGIN;
  const obj = { success: true };

  const animateCar = ({ duration, draw }: IAnimate) => {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      draw(timeFraction);

      if (!obj.success) {
        timeFraction = 1;
      }

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  };

  const drawCar = (progress: number) => {
    const target = carRef.current;

    if (target) {
      target.style.transform = `translateX(${progress * raceDistance}px)`;
    }
  };

  const handleStartClick = () => {
    const res = startEngine(id);
    res.then(({ distance, velocity }: { distance: number; velocity: number }) => {
      driveMode(id).then((res: { success: boolean }) => (obj.success = res.success));
      animateCar({ duration: distance / velocity, draw: drawCar });
    });
  };
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
            <button className={styles.startBtn} onClick={handleStartClick}>
              A
            </button>
            <button className={`${styles.stopBtn} ${styles.inactiveBtn}`} disabled>
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
