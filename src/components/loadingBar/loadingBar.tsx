import styles from './loadingBar.module.css';

export function LoadingBar() {
  return (
    <div className={styles.overlay}>
      <div className={styles.loading}>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
