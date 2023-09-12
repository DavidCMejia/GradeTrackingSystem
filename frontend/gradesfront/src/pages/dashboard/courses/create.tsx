import { Typography } from '@mui/material';
import { NextPage } from 'next';

type CreateCourseProps = {
  userName: string;
}

const CreateCourse: NextPage<CreateCourseProps> = () => {
  const hola = 'hola';
  return (
    <h1>Create Course </h1>
  );
};

export default CreateCourse;
