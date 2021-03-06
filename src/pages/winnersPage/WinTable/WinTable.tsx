import { useCallback, useEffect, useState } from "react";
import {
  getCar,
  IFullCarData,
  IWinnerDataResponse,
  Sort,
} from "../../../api/api";
import { CarImg } from "../../../components/CarImg/CatImg";
import styles from "./WinTable.styles.css";

interface IPropsType {
  data: IWinnerDataResponse[];
  handleSort: (type: Sort) => void;
}

export const WinTable = ({ data, handleSort }: IPropsType) => {
  const [winnersData, setWinnersData] = useState<IFullCarData[]>([]);

  const getWinnerName = useCallback(() => {
    data.forEach((el) => {
      getCar(el.id).then((car) =>
        setWinnersData((prev) => [
          ...prev,
          {
            id: el.id,
            wins: el.wins,
            time: el.time,
            name: car.name,
            color: car.color,
          },
        ])
      );
    });
  }, [data]);

  useEffect(() => {
    setWinnersData([]);
    getWinnerName();
  }, [data, getWinnerName]);

  return (
    <section style={styles}>
      <p>Page #1</p>
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Car</th>
            <th>Name</th>
            <th>
              <span
                className={styles.sortable}
                onClick={() => handleSort(Sort.wins)}
              >
                Wins
              </span>
            </th>
            <th>
              <span
                className={styles.sortable}
                onClick={() => handleSort(Sort.time)}
              >
                Best time (sec)
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </section>
  );
};
