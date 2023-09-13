import { Typography } from '@mui/material';
import { NextPage } from 'next';

type CreateScheduleProps = {
  userName: string;
}

const CreateSchedule: NextPage<CreateScheduleProps> = () => {
  const hola = 'hola';
  return (
    <h1>Create Course </h1>
  );
};

export default CreateSchedule;
