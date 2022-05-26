import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { getWinners, IWinnerDataResponse, Order, Sort } from '../../../api/api';
import { WinTable } from '../WinTable/WinTable';
import styles from './Winners.styles.css';

export const Winners = () => {
  const [winnersArray, setWinnersArray] = useState<IWinnerDataResponse[]>([]);
  const [winnersNumber, setwinnersNumber] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(Sort.id);
  const [order, setorder] = useState(Order.ASC);

  async function getWinnersState(page: number, limit = 10, sort = Sort.id, order = Order.ASC): Promise<void> {
    const { count: winnersCount, items } = await getWinners(page, limit, sort, order);
    if (winnersCount) {
      setwinnersNumber(+winnersCount);
    }
    if (items) {
      setWinnersArray(items);
    }
  }

  useEffect(() => {
    getWinnersState(page, 10, sort, order);
  }, [page, sort, order]);

  const handleChangePage = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLElement;
    switch (target.textContent) {
      case 'next':
        setPage((prevValue) => prevValue + 1);
        break;
      case 'prev':
        setPage((prevValue) => prevValue - 1);
        break;
    }
  }, []);

  const handleSort = useCallback((type: Sort): void => {
    setSort(type);
    setorder((prev) => (prev === Order.ASC ? Order.DESC : Order.ASC));
  }, []);

  return (
    <>
      <h2>
        Winners <span>({winnersNumber})</span>
      </h2>
      <WinTable data={winnersArray} handleSort={handleSort} />
      <div className={styles.btnContainer}>
        <button onClick={handleChangePage} disabled={page <= 1 ? true : false}>
          prev
        </button>
        <button
          className={styles.paginationBtn}
          onClick={handleChangePage}
          disabled={winnersNumber / 10 <= page ? true : false}
        >
          next
        </button>
      </div>
    </>
  );
};
