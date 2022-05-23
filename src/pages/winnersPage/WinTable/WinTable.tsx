import { useContext } from 'react';
import { IWinnerDataResponse } from '../../../api/api';
import { WinnersContext } from '../../../App';
import styles from './WinTable.styles.css';

interface IPropsType {
  data: IWinnerDataResponse[];
}

export const WinTable = ({ data }: IPropsType) => {
  const winnersData = useContext(WinnersContext);
  // console.log(winnersData);
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
        {data.map((el, index) => {
          return (
            <tr key={el.id}>
              <td>{index + 1}</td>
              <td>car</td>
              <td>{el.id}</td>
              <td>{el.wins}</td>
              <td>{el.time}</td>
            </tr>
          );
        })}
      </table>
    </section>
  );
};
