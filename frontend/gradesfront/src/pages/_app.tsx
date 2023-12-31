import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import Navbar from '../components/navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <Navbar />
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <br /><br /><br /><br /><br />
          <Component {...pageProps} />
        </UserProvider>
      </PersistGate>
    </Provider>
  );
}
