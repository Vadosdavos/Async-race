import { useRef } from 'react';
import { ICar } from '../../../api/api';
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
  timing: (timeFraction: number) => number;
}

export const Track = ({ name, color, id, onDelete, onSelect }: TrackProps): JSX.Element => {
  const carRef = useRef<HTMLInputElement>(null);

  const animateCar = ({ duration, draw, timing }: IAnimate) => {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      let progress = timing(timeFraction);

      draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  };

  const drawCar = (progress: number) => {
    const target = carRef.current;
    if (target) {
      target.style.transform = `translateX(${progress * 1000}px)`;
    }
  };

  const linear = (timeFraction: number) => {
    return timeFraction;
  };

  const handleStartClick = () => {
    console.log(id);
    animateCar({ duration: 2000, draw: drawCar, timing: linear });
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
