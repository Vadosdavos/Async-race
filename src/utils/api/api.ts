const base = 'https://async-race-lemon.vercel.app/';
const garage = `${base}/garage`;
const engine = `${base}/engine`;
const winners = `${base}/winners`;

export interface ICarSet {
  name: string;
  color: string;
}
export interface ICar extends ICarSet {
  id: number;
}
interface IWinnerUpdate {
  wins: number;
  time: number;
}
export interface IWinnerSet extends IWinnerUpdate {
  id: number;
}

interface IGarage {
  items: ICar[];
  count: string | null;
}

export interface IWinnerData {
  id: number;
  name: string;
  time: number;
}

export interface IWinnerDataResponse extends IWinnerData {
  wins: number;
}

export interface IFullCarData {
  id: number;
  name: string;
  wins: number;
  time: number;
  color: string;
}

export interface IMove {
  carAnim: { [key: string]: number };
  start: (carProps: ICar, carRef: HTMLDivElement) => void;
  stop: (carProps: ICar, carRef: HTMLDivElement) => void;
  anim: (
    duration: number,
    start: number,
    target: HTMLDivElement,
    carProps: ICar
  ) => void;
}

interface IWinners {
  items: IWinnerDataResponse[];
  count: string | null;
}

export enum Sort {
  id = 'id',
  wins = 'wins',
  time = 'time',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const getCars = async (page: number, limit = 7): Promise<IGarage> => {
  const res = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  return {
    items: await res.json(),
    count: res.headers.get('X-Total-Count'),
  };
};

export const getCar = async (id: number): Promise<ICar> => (await fetch(`${garage}/${id}`)).json();

export const setCar = async (body: ICarSet) => (
  await fetch(garage, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const deleteCar = async (id: number) => (
  await fetch(`${garage}/${id}`, {
    method: 'DELETE',
  })
).json();

export const updateCar = async (id: number, body: ICarSet) => (
  await fetch(`${garage}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const startEngine = async (id: number) => (
  await fetch(`${engine}?id=${id}&status=started`, { method: 'PATCH' })
).json();

export const stopEngine = async (id: number) => (
  await fetch(`${engine}?id=${id}&status=stopped`, { method: 'PATCH' })
).json();

export const driveMode = async (id: number): Promise<{ success: boolean }> => {
  const res = await fetch(`${engine}?id=${id}&status=drive`, {
    method: 'PATCH',
  }).catch();
  return res.status !== 200 ? { success: false } : { success: true };
};

export const getWinners = async (
  page: number,
  limit = 10,
  sort: Sort = Sort.wins,
  order: Order = Order.ASC,
): Promise<IWinners> => {
  const res = await fetch(
    `${winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
  );
  return {
    items: await res.json(),
    count: res.headers.get('X-Total-Count'),
  };
};

export const setWinner = async (body: IWinnerSet) => (
  await fetch(winners, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const updateWinner = async (id: number, body: IWinnerUpdate) => (
  await fetch(`${winners}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
).json();

export const getWinner = async (id: number): Promise<IWinnerSet> => (await fetch(`${winners}/${id}`)).json();

export const deleteWinner = async (id: number) => (
  await fetch(`${winners}/${id}`, {
    method: 'DELETE',
  })
).json();
