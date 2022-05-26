import { forwardRef, SyntheticEvent, useCallback, useRef } from "react";
import styles from "./FormField.styles.css";

type FormProps = {
  type: string;
  handleTextInput: (event: SyntheticEvent) => void;
  handleColorInput: (event: SyntheticEvent) => void;
  handleClick: () => void;
  colorUpdateValue?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormProps>(
  function FormField(
    { type, handleTextInput, handleColorInput, handleClick, colorUpdateValue },
    ref
  ): JSX.Element {
    const nameRef = useRef<HTMLInputElement>(null);
    const colorRef = useRef<HTMLInputElement>(null);
    const clearInput = useCallback((): void => {
      if (nameRef.current && colorRef.current) {
        nameRef.current.value = "";
        colorRef.current.value = "#000000";
      }
    }, [nameRef, colorRef]);

    if (type === "create") {
      return (
        <>
          <div className={styles.formField}>
            <input
              type="text"
              ref={nameRef}
              className={`${styles.textInput} ${styles[type]}`}
              onBlur={handleTextInput}
            />
            <input
              type="color"
              ref={colorRef}
              className="colorInput"
              onBlur={handleColorInput}
            />
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
    return (
      <>
        <div className={styles.formField}>
          <input
            type="text"
            ref={ref}
            className={`${styles.textInput} ${styles[type]}`}
            onBlur={handleTextInput}
            disabled
          />
          <input
            type="color"
            className="colorInput"
            defaultValue={colorUpdateValue}
            onBlur={handleColorInput}
          />
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
);
