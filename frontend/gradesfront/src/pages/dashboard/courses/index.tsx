import { NextPage } from 'next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { message } from 'antd';
import {
  Collection,
  isEmpty,
  map,
} from 'lodash';
import { CSSProperties, useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Add from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { URL_BACKEND } from '../../../constants';
import { Course, Student } from '../../../types';
import ModalStudents from '../../../components/modalStudents';

const Courses: NextPage = () => {
  const [coursesData, setCoursesData] = useState<Course[]>();
  const [openStudentModal, setOpenStudentModal] = useState<boolean>(false);
  const [studentsIds, setStudentsIds] = useState<number[]>([]);
  const [studentsList, setStudentsList] = useState<Collection<Student[]>>();
  const { push, asPath } = useRouter();

  const handleEditClick = (row: Course) => {
    console.log('Editar:', row);
  };

  const viewStudents = (studentsRow: number[]) => {
    setStudentsIds(studentsRow);
    setOpenStudentModal(true);
  };

  const closeStudentsModal = () => {
    setOpenStudentModal(false);
  };

  const fetchCourses = () => {
    axios.get(`${URL_BACKEND}/api/courses/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setCoursesData(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const fetchStudents = () => {
    axios.get(`${URL_BACKEND}/api/students/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setStudentsList(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  if (isEmpty(coursesData)) {
    return (
      <Typography variant="h3" align="center" gutterBottom>
        <CircularProgress />
        Loading...
      </Typography>
    );
  }
  const centerRow: CSSProperties = {
    textAlign: 'center',
  };
  return (

    <>
      <Typography variant="h4" align="center" gutterBottom>
        Courses
        <br />
        <Button variant="outlined" color="success" onClick={() => push(`${asPath}/create`)}><Add /></Button>
      </Typography>
      <TableContainer
        component={Paper}
        style={{
          border: '1px solid #ccc', margin: 'auto', maxWidth: '40%', minWidth: '600px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={centerRow}>id</TableCell>
              <TableCell style={centerRow}>Name</TableCell>
              <TableCell style={centerRow}>Code</TableCell>
              <TableCell style={centerRow}>Professor</TableCell>
              <TableCell style={centerRow}>Students</TableCell>
              <TableCell style={centerRow}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coursesData && map(coursesData, (course) => (
              <TableRow key={course.id}>
                <TableCell style={centerRow}>{course.id}</TableCell>
                <TableCell style={centerRow}>{course.course_name}</TableCell>
                <TableCell style={centerRow}>{course.course_code}</TableCell>
                <TableCell style={centerRow}>{course.professor}</TableCell>
                <TableCell style={centerRow}>
                  <Button onClick={() => viewStudents(course.students)}><VisibilityIcon /></Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEditClick(course)}><EditIcon /></Button>
                  <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleEditClick(course)}><DeleteIcon /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {studentsList && (
        <ModalStudents
          handleOpen={openStudentModal}
          handleCancel={closeStudentsModal}
          studentsList={studentsList}
          studentsIds={studentsIds}
        />
      )}

    </>
  );
};

export default Courses;
