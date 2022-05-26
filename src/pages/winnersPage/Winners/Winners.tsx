import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { getWinners, IWinnerDataResponse, Order, Sort } from "../../../api/api";
import { WinTable } from "../WinTable/WinTable";
import styles from "./Winners.styles.css";

export const Winners = () => {
  const [winnersArray, setWinnersArray] = useState<IWinnerDataResponse[]>([]);
  const [winnersNumber, setwinnersNumber] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [curSort, setCurSort] = useState(Sort.id);
  const [curOrder, setCurOrder] = useState(Order.ASC);

  async function getWinnersState(
    page: number,
    limit = 10,
    sort = Sort.id,
    order = Order.ASC
  ): Promise<void> {
    const { count: winnersCount, items } = await getWinners(
      page,
      limit,
      sort,
      order
    );
    if (winnersCount) {
      setwinnersNumber(+winnersCount);
    }
    if (items) {
      setWinnersArray(items);
    }
  }

  useEffect(() => {
    getWinnersState(curPage, 10, curSort, curOrder);
  }, [curPage, curSort, curOrder]);

  const handleChangePage = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLElement;
    switch (target.textContent) {
      case "next":
        setCurPage((prevValue) => prevValue + 1);
        break;
      case "prev":
        setCurPage((prevValue) => prevValue - 1);
        break;
      default:
        setCurPage(1);
    }
  }, []);

  const handleSort = useCallback((type: Sort): void => {
    setCurSort(type);
    setCurOrder((prev) => (prev === Order.ASC ? Order.DESC : Order.ASC));
  }, []);

  return (
    <>
      <h2>
        Winners <span>({winnersNumber})</span>
      </h2>
      <WinTable data={winnersArray} handleSort={handleSort} />
      <div className={styles.btnContainer}>
        <button onClick={handleChangePage} disabled={curPage <= 1}>
          prev
        </button>
        <button
          className={styles.paginationBtn}
          onClick={handleChangePage}
          disabled={winnersNumber / 10 <= curPage}
        >
          next
        </button>
      </div>
    </>
  );
};
