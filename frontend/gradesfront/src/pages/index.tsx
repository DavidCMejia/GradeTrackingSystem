/* eslint-disable react/jsx-no-useless-fragment */
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import {
  Typography, Box,
  Card,
  Button,
  CardActions,
  CardContent,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import WelcomeMessage from '../components/welcome';
import { URL_BACKEND } from '../constants';
import { selectUser } from '../selectors/mainSelectors';

export default function Home() {
  const { user } = useUser();
  const [role, setRole] = useState<number>(0);
  const userRedux = useSelector(selectUser);
  console.log('🚀 ~ userRedux:', userRedux);

  const card = (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Please select one of the following options:
        </Typography>
        <Typography variant="h5" component="div">
          Are you a...
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="large"
          onClick={() => { setRole(1); }}
          href={`verifyInfo/${role}`}
        >
          Professor
        </Button>
        <Button
          size="large"
          onClick={() => { setRole(2); }}
          href={`verifyInfo/${role}`}
        >
          Student
        </Button>
      </CardActions>
    </>
  );

  return (
    <>
      {user ? (
        user.name && (
        <>
          <WelcomeMessage userName={user.name} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ minWidth: 275, maxWidth: 500 }}>
              <Card variant="outlined">{card}</Card>
            </Box>
          </Box>
        </>
        )
      ) : (
        <>
          <Typography variant="h3" textAlign="center">Welcome to Grade Tracking System App!</Typography>
          <Typography textAlign="center">
            In order to use our system, we invite you to log in at the top right corner.
            <br />
            If you are a dev,
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
