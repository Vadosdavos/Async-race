import Head from 'next/head';
import { Header } from './header/header';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Async Race</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>
        {children}
      </main>
    </>
  );
}
