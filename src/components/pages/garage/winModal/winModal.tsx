import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './winModal.module.css';

export const WinModal = (props: { children: React.ReactNode }) => {
  const container = document.createElement('div');
  container.className = styles.modal;

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  });

  return ReactDOM.createPortal(props.children, container);
};
