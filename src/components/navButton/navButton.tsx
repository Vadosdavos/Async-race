import Link from 'next/link';
import styles from './navButton.module.css';

type NavButtonProps = {
  title: string;
  path: string;
};

export function NavButton({ title, path }: NavButtonProps): JSX.Element {
  return (
    <Link href={path} legacyBehavior passHref>
      <a className={styles.headerButton}>
        {title}
      </a>
    </Link>
  );
}
