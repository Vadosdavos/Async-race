import { useEffect, useState } from 'react';
import { getCar, IFullCarData, IWinnerDataResponse } from '../../../api/api';
import { CarImg } from '../../../components/CarImg/CatImg';
import styles from './WinTable.styles.css';

interface IPropsType {
  data: IWinnerDataResponse[];
}

export const WinTable = ({ data }: IPropsType) => {
  const [winnersData, setWinnersData] = useState<IFullCarData[]>([]);

  const getWinnerName = () => {
    data.forEach((el) => {
      getCar(el.id).then((car) =>
        setWinnersData((prev) => [
          ...prev,
          { id: el.id, wins: el.wins, time: el.time, name: car.name, color: car.color },
        ])
      );
    });
  };

  useEffect(() => {
    setWinnersData([]);
    getWinnerName();
  }, [data]);

  return (
    <section style={styles}>
      <p>Page #1</p>
      <table>
        <tr>
          <th>Number</th>
          <th>Car</th>
          <th>Name</th>
          <th>Wins</th>
          <th>Best time (sec)</th>
        </tr>
        {winnersData.map((el, index) => {
          return (
            <tr key={el.id}>
              <td>{index + 1}</td>
              <td>
                <div className={styles.car}>
                  <CarImg color={el.color} />
                </div>
              </td>
              <td>{el.name}</td>
              <td>{el.wins}</td>
              <td>{el.time}</td>
            </tr>
          );
        })}
      </table>
    </section>
  );
};
