import { brandsCars } from './brands-cars';
import { modelsCars } from './models-cars';

export const getRandomNames = () => {
  const initBrands = [...brandsCars, ...brandsCars].sort(() => Math.random() - 0.5);
  const initModels = [...modelsCars, ...modelsCars].sort(() => Math.random() - 0.5);
  return initBrands.map((el, index) => `${el} ${initModels[index]}`);
};

export const getRandomColor = () => {
  const leters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += leters[Math.floor(Math.random() * leters.length)];
  }
  return color;
};

export const generateRandomCars = () => {
  return getRandomNames().map((el) => ({ name: el, color: getRandomColor() }));
};
