import React from 'react';
import './App.css';
import ListGames from './components/molescules/ListGames/ListGames';
import Header from './components/organisms/Header/Header';
import { ModalProvider } from './components/molescules/ModalCreate/ModalContext';

const App: React.FC = () => {
  return (
    <ModalProvider>
      <Header />
      <ListGames />
    </ModalProvider>
  );
}

export default App;
