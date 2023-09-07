import { Typography } from '@mui/material';
import { FC } from 'react';

type WelcomeMessageProps = {
  userName: string;
}

const WelcomeMessage: FC<WelcomeMessageProps> = ({ userName }) => (

  <div style={{ textAlign: 'center', padding: '20px' }}>
    <Typography variant="h3">
      Welcome
      {' '}
      {userName}
      {' '}
      !
    </Typography>
    <Typography>
      Thank you for signing in to our application!
    </Typography>
  </div>
);

export default WelcomeMessage;
