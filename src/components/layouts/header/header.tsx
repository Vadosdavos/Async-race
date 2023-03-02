import { NavButton } from '../../navButton/navButton';
import styles from './header.module.css';

export function Header() {
  return (
    <header className={styles.mainHeader}>
      <NavButton title="to garage" path="/" />
      <NavButton title="to winners" path="winners" />
    </header>
  );
}
