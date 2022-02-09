import { CarImg } from '../../../components/CarImg/CatImg';
import styles from './Car.styles.css';

type CarProps = {
  color: string;
};

export const Car = ({ color }: CarProps) => {
  return (
    <div className={styles.car}>
      <CarImg color={color} />
    </div>
  );
};
