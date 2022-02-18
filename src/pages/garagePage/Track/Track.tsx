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
  const [isCarStarted, setIsCarStarted] = useState(false);

  const animateCar = ({ duration, draw }: IAnimate) => {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      draw(timeFraction);
      console.log(obj.success);
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
    setIsCarStarted(true);
    const res = startEngine(id);
    res.then(({ distance, velocity }: { distance: number; velocity: number }) => {
      driveMode(id).then((res: { success: boolean }) => (obj.success = res.success));
      animateCar({ duration: distance / velocity, draw: drawCar });
    });
  };

  const handleStopClick = () => {
    setIsCarStarted(false);
    const target = carRef.current;
    stopEngine(id).then(({ distance, velocity }: { distance: number; velocity: number }) => {
      animateCar({ duration: distance / velocity, draw: drawCar });
      target ? (target.style.transform = `translateX(0)`) : null;
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
            <button
              className={`${styles.startBtn} ${isCarStarted && styles.inactiveBtn}`}
              onClick={handleStartClick}
              disabled={isCarStarted}
            >
              A
            </button>
            <button
              className={`${styles.stopBtn} ${!isCarStarted && styles.inactiveBtn}`}
              onClick={handleStopClick}
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
