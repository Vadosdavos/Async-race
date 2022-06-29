import styles from "./LoadingBar.styles.css";

export const LoadingBar = () => {
  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.loading}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};
