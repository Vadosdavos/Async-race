const base = 'http://127.0.0.1:3000';
const garage = `${base}/garage`;

export interface ICar {
  name: string;
  color: string;
  id: number;
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
