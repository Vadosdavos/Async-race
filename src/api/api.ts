const base = 'http://127.0.0.1:3000';
const garage = `${base}/garage`;

export interface ICar extends ICarSet {
  id: number;
}

export interface ICarSet {
  name: string;
  color: string;
}

interface IGarage {
  items: ICar[];
  count: string | null;
}

export const getCars = async (page: number, limit: number = 7): Promise<IGarage> => {
  const res = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  return {
    items: await res.json(),
    count: res.headers.get('X-Total-Count'),
  };
};

export const getCar = async (id: number) => (await fetch(`${garage}/${id}`)).json();

export const setCar = async (body: ICarSet) =>
  (
    await fetch(garage, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const deleteCar = async (id: number) =>
  (
    await fetch(`${garage}/${id}`, {
      method: 'DELETE',
    })
  ).json();
