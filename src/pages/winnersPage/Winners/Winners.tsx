import { useEffect, useState } from 'react';
import { getWinners, IWinnerDataResponse } from '../../../api/api';
import { WinTable } from '../WinTable/WinTable';
import styles from './Winners.styles.css';

export const Winners = () => {
  const [winnersArray, setWinnersArray] = useState<IWinnerDataResponse[]>([]);
  const [winnersNumber, setwinnersNumber] = useState(0);
  const [page, setPage] = useState(1);

  async function getWinnersState(page: number): Promise<void> {
    const { count: winnersCount, items } = await getWinners(page);
    if (winnersCount) {
      setwinnersNumber(+winnersCount);
    }
    if (items) {
      setWinnersArray(items);
    }
  }

  useEffect(() => {
    getWinnersState(page);
  }, []);

  return (
    <>
      <h2>
        Winners <span>({winnersNumber})</span>
      </h2>
      <WinTable data={winnersArray} />
      <div>
        <button>prev</button>
        <button>next</button>
      </div>
    </>
  );
};
