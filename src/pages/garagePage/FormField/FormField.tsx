import { getCars } from '../../../api/api';
import styles from './FormField.styles.css';

type FormProps = {
  type: string;
};

export const FormField = ({ type }: FormProps) => {
  function bar() {
    console.log('bar');
  }
  function foo() {
    console.log('foo');
  }

  return (
    <>
      <div className={styles.formField}>
        <input type='text' className={styles.textInput + ' ' + styles[type]} />
        <input type='color' className='colorInput' />
        <button onClick={type === 'create' ? bar : foo} className={styles.subButton}>
          {type}
        </button>
      </div>
    </>
  );
};
