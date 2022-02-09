import { SyntheticEvent } from 'react';
import styles from './FormField.styles.css';

type FormProps = {
  type: string;
  handleTextInput: (event: SyntheticEvent) => void;
  handleColorInput: (event: SyntheticEvent) => void;
  handleClick: () => void
};

export const FormField = ({ type, handleTextInput, handleColorInput, handleClick }: FormProps) => {

  return (
    <>
      <div className={styles.formField}>
        <input type='text' className={`${styles.textInput} ${styles[type]}`} onBlur={handleTextInput} />
        <input type='color' className='colorInput' onBlur={handleColorInput} />
        <button className={styles.subButton} onClick={handleClick}>{type}</button>
      </div>
    </>
  );
};
