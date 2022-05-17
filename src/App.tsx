import { Header } from './components/Header/Header';
import { Garage } from './pages/garagePage/garage/Garage';
import { Route, Routes } from 'react-router-dom';
import './style.css';
import { Winners } from './pages/winnersPage/Winners/Winners';
import { createContext, useState } from 'react';

export const WinnersContext = createContext({});

export const App = () => {
  const [winners, setWinners] = useState({});
  return (
    <>
      <Header />
      <main>
        <WinnersContext.Provider value={winners}>
          <Routes>
            <Route path='/' element={<Garage updateWinners={setWinners} />} />
            <Route path='/winners' element={<Winners />} />
          </Routes>
        </WinnersContext.Provider>
      </main>
    </>
  );
};
