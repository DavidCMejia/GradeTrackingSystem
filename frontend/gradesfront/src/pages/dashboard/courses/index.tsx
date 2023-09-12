import { NextPage } from 'next';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, CircularProgress,
} from '@mui/material';
import { message } from 'antd';
import { isEmpty, map } from 'lodash';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { URL_BACKEND } from '../../../constants';
import { Course } from '../../../types';

const Courses: NextPage = () => {
  const [coursesData, setCoursesData] = useState<Course[]>();

  const handleEditClick = (row: Course) => {
    console.log('Editar:', row);
  };

  useEffect(() => {
    axios.get(`${URL_BACKEND}/api/courses/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setCoursesData(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  }, []);

  if (isEmpty(coursesData)) {
    return (
      <Typography variant="h3" align="center" gutterBottom>
        <CircularProgress />
        Loading...
      </Typography>
    );
  }

  return (

    <>
      <Typography variant="h4" align="center" gutterBottom>
        Courses
      </Typography>
      <TableContainer component={Paper} style={{ border: '1px solid #ccc', margin: 'auto', width: '30%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coursesData && map(coursesData, (course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.course_code}</TableCell>
                <TableCell>{course.professor}</TableCell>
                <TableCell>{course.students}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEditClick(course)}><EditIcon /></Button>
                  <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleEditClick(course)}><DeleteIcon /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </>
  );
};

export default Courses;
