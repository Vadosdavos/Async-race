/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { NextApiRequest, NextApiResponse } from 'next';

const jsonServer = require('json-server');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const db = {
    garage: [
      {
        name: 'Tesla',
        color: '#e6e6fa',
        id: 1,
      },
      {
        name: 'BMW',
        color: '#fede00',
        id: 2,
      },
      {
        name: 'Mersedes',
        color: '#6c779f',
        id: 3,
      },
      {
        name: 'Ford',
        color: '#ef3c40',
        id: 4,
      },
    ],
    winners: [
      {
        id: 1,
        wins: 1,
        time: 10,
      },
    ],
  };

  const myServer = jsonServer.create();
  const router = jsonServer.router(db);
  const middlewares = jsonServer.defaults();

  const port = process.env.PORT || 3001;

  type State = {
    velocity: { [key in string]: number };
    blocked: { [key in string]: boolean };
  };

  const state: State = { velocity: {}, blocked: {} };

  myServer.use(middlewares);

  myServer.patch('/engine', (req: any, res: any) => {
    const { id, status } = req.query;

    if (!id || !status || !/^(started)|(stopped)|(drive)$/.test(status)) {
      return res.status(400).send('Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"');
    }

    if (!db.garage.find((car) => car.id === +id)) {
      return res.status(404).send('Car with such id was not found in the garage.');
    }

    const distance = 500000;
    if (status === 'drive') {
      const velocity = state.velocity[id];

      if (!velocity) return res.status(404).send('Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?');
      if (state.blocked[id]) return res.status(429).send('Drive already in progress. You can\'t run drive for the same car twice while it\'s not stopped.');

      state.blocked[id] = true;

      const x = Math.round(distance / velocity);

      if (new Date().getMilliseconds() % 3 === 0) {
        setTimeout(() => {
          delete state.velocity[id];
          delete state.blocked[id];
          res.header('Content-Type', 'application/json').status(500).send('Car has been stopped suddenly. It\'s engine was broken down.');
        }, Math.random() * x ^ 0);
      } else {
        setTimeout(() => {
          delete state.velocity[id];
          delete state.blocked[id];
          res.header('Content-Type', 'application/json').status(200).send(JSON.stringify({ success: true }));
        }, x);
      }
    } else {
      const x = req.query.speed ? +req.query.speed : Math.random() * 2000 ^ 0;

      const velocity = status === 'started' ? Math.max(50, Math.random() * 200 ^ 0) : 0;

      if (velocity) {
        state.velocity[id] = velocity;
      } else {
        delete state.velocity[id];
        delete state.blocked[id];
      }

      setTimeout(() => res.header('Content-Type', 'application/json').status(200).send(JSON.stringify({ velocity, distance })), x);
    }
  });

  myServer.use(router);
  myServer.listen(port, () => {
    console.log('Server is running on port', port);
  });
  res.status(200).send({ message: 'Server had started!' });
}
