import { SyntheticEvent, useRef } from 'react';
import styles from './FormField.styles.css';

type FormProps = {
  type: string;
  handleTextInput: (event: SyntheticEvent) => void;
  handleColorInput: (event: SyntheticEvent) => void;
  handleClick: () => void;
};

export const FormField = ({ type, handleTextInput, handleColorInput, handleClick }: FormProps): JSX.Element => {
  const nameRef = useRef(null);
  const colorRef = useRef(null);
  const clearInput = (): void => {
    if (nameRef.current && colorRef.current) {
      const nameInput = nameRef.current as HTMLInputElement;
      const colorInput = colorRef.current as HTMLInputElement;
      nameInput.value = '';
      colorInput.value = '#000000';
    }
  };

  if (type === 'create') {
    return (
      <>
        <div className={styles.formField}>
          <input type='text' ref={nameRef} className={`${styles.textInput} ${styles[type]}`} onBlur={handleTextInput} />
          <input type='color' ref={colorRef} className='colorInput' onBlur={handleColorInput} />
          <button
            className={styles.subButton}
            onClick={() => {
              handleClick();
              clearInput();
            }}
          >
            {type}
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.formField}>
          <input type='text' ref={nameRef} className={`${styles.textInput} ${styles[type]}`} onBlur={handleTextInput} />
          <input type='color' ref={colorRef} className='colorInput' onBlur={handleColorInput} />
          <button
            className={styles.subButton}
            onClick={() => {
              handleClick();
              clearInput();
            }}
          >
            {type}
          </button>
        </div>
      </>
    );
  }

  
};
