/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unescaped-entities */
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { Typography } from '@mui/material';
import WelcomeMessage from '../components/welcome';
import { URL_BACKEND } from '../constants';

export default function Home() {
  const { user } = useUser();
  return (
    <>
      {user ? (
        user.name && <WelcomeMessage userName={user.name} />
      ) : (
        <>
          <Typography variant="h3" textAlign="center">Welcome to Grade-App!</Typography>
          <Typography textAlign="center">
            In order to use our system, we invite you to log in at the top right corner.
            If you're a dev,
            {' '}
            <Link href={`${URL_BACKEND}/docs`}>here</Link>
            {' '}
            you can find the API Docs.
          </Typography>
        </>
      )}
    </>
  );
}
