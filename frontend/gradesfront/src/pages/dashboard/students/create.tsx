import { Typography } from '@mui/material';
import { NextPage } from 'next';

type CreateCourseProps = {
  userName: string;
}

const CreateStudent: NextPage<CreateCourseProps> = () => {
  const hola = 'hola';
  return (
    <h1>Create Student </h1>
  );
};

export default CreateStudent;
