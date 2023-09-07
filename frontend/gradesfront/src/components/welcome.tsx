import { Typography } from '@mui/material';
import { FC } from 'react';

type WelcomeMessageProps = {
  userName: string;
}

const WelcomeMessage: FC<WelcomeMessageProps> = ({ userName }) => (
  <Typography
    sx={{
      mr: 2,
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.3rem',
      color: 'inherit',
      textDecoration: 'none',
    }}
  >
    <div style={{ textAlign: 'center', padding: '20px' }}>

      <h1>
        Welcome,
        {' '}
        {userName}
        {' '}
        !
      </h1>
      <p>Thank you for signing in to our application!</p>

    </div>
  </Typography>
);

export default WelcomeMessage;
