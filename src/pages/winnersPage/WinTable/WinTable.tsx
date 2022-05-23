import { useContext, useState } from 'react';
import { getCar, IWinnerDataResponse } from '../../../api/api';
import { WinnersContext } from '../../../App';
import styles from './WinTable.styles.css';

interface IPropsType {
  data: IWinnerDataResponse[];
}

export const WinTable = ({ data }: IPropsType) => {
  // const winnersData = useContext(WinnersContext);
  const [winnersNames, setWinnersNames] = useState<{ id: number; name: string }[]>([]);

  // const getWinnerName = async () => {
  //   const arr = data.map(el => {id: el.id, name: await getCar(el.id)})
  // };
  console.log(data);
  return (
    <section style={styles}>
      <p>Page #1</p>
      <table>
        <tr>
          <th>Number</th>
          <th>Name</th>
          <th>Wins</th>
          <th>Best time (sec)</th>
        </tr>
        {data.map((el, index) => {
          return (
            <tr key={el.id}>
              <td>{index + 1}</td>
              {/* <td>{getWinnerName(el.id)}</td> */}
              <td>{el.wins}</td>
              <td>{el.time}</td>
            </tr>
          );
        })}
      </table>
    </section>
  );
};
