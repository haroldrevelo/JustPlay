import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

type ModalContextProps = {
  update: boolean;
  setUpdate: Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [update, setUpdate] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <ModalContext.Provider value={{ update, setUpdate, searchText, setSearchText }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export {};
