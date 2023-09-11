import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Navbar from '../components/navbar';
import { persistor, store } from '../store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <Navbar />
          <Component {...pageProps} />
        </UserProvider>
      </PersistGate>
    </Provider>
  );
}
