import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Provider } from 'react-redux';
import Navbar from '../components/navbar';
import { store } from '../store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <UserProvider>
        <Navbar />
        <Component {...pageProps} />
      </UserProvider>
    </Provider>
  );
}
