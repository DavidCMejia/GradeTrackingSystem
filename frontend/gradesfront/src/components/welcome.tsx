import { Typography } from '@mui/material';
import { FC } from 'react';

type WelcomeMessageProps = {
  userName: string;
}

const WelcomeMessage: FC<WelcomeMessageProps> = ({ userName }) => (
  <>
    <Typography variant="h3" textAlign="center">
      Welcome
      {' '}
      {userName}
      {' '}
      !
    </Typography>
    <Typography textAlign="center">
      Thank you for signing in to our application!
    </Typography>
  </>
);

export default WelcomeMessage;
