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
  TextField,
} from '@mui/material';

import { message } from 'antd';

import {
  Collection,
  find,
  get,
  isEmpty,
  map,
  orderBy,
} from 'lodash';

import { CSSProperties, useEffect, useState } from 'react';
import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Add from '@mui/icons-material/Add';

import { useRouter } from 'next/router';
import { URL_BACKEND } from '../../../constants';
import type { Course, Professor, Student } from '../../../types';

import ModalStudents from '../../../components/modalStudents';
import ModalEditCourse from '@/src/components/modalEditCourse';

const Courses: NextPage = () => {
  const [coursesData, setCoursesData] = useState<Course[]>();
  const [studentsList, setStudentsList] = useState<Collection<Student[]>>();
  const [professorsList, setProfessorsList] = useState<Collection<Professor[]>>();
  const [openStudentModal, setOpenStudentModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [studentsIds, setStudentsIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const { push, asPath } = useRouter();

  const handleEditClick = (row: Course) => {
    setOpenEditModal(true);
    setSelectedCourse(row);
  };

  const viewStudents = (studentIds: number[]) => {
    setStudentsIds(studentIds);
    setOpenStudentModal(true);
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

  const fetchStudents = () => { // TODO: Pasar a redux en /dashboard si se vuelve a repetir
    axios.get(`${URL_BACKEND}/api/students/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setStudentsList(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const fetchProfessors = () => { // TODO: Pasar a redux en /dashboard si se vuelve a repetir
    axios.get(`${URL_BACKEND}/api/professors/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setProfessorsList(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchProfessors();
  }, []);

  if (isEmpty(coursesData)) {
    return (
      <Typography variant="h3" align="center" gutterBottom>
        <CircularProgress />
        Loading...
      </Typography>
    );
  }

  const sortedCoursesData = orderBy(coursesData, 'course_code', 'asc');
  const filteredData:Course[] = sortedCoursesData
    .filter(
      (course) => course.course_name.toLowerCase().includes(searchText.toLowerCase())
  || course.course_code.toLowerCase().includes(searchText.toLowerCase())
  || course.professor.toString().toLowerCase().includes(searchText.toLowerCase()),
    );

  const rowTitleStyle: CSSProperties = {
    textAlign: 'center',
    fontWeight: 'bold',
  };
  const centerRowStyle: CSSProperties = {
    textAlign: 'center',
  };

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Courses
        <br />
        <Button variant="outlined" color="success" onClick={() => push(`${asPath}/create`)}><Add /></Button>
        <br />
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            marginBottom: '20px', marginTop: '20px', maxWidth: '100px', minWidth: '600px',
          }}
        />
      </Typography>
      <TableContainer
        component={Paper}
        style={{
          border: '1px solid #ccc', margin: 'auto', maxWidth: '100px', minWidth: '600px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={rowTitleStyle}>Code</TableCell>
              <TableCell style={rowTitleStyle}>id</TableCell>
              <TableCell style={rowTitleStyle}>Name</TableCell>
              <TableCell style={rowTitleStyle}>Professor</TableCell>
              <TableCell style={rowTitleStyle}>Students</TableCell>
              <TableCell style={rowTitleStyle}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && map(filteredData, (course) => {
              const foundProfessor = professorsList
              && find(professorsList, { id: course.professor });

              return (
                <>
                  <TableRow key={course.id}>
                    <TableCell style={centerRowStyle}>{course.course_code}</TableCell>
                    <TableCell style={centerRowStyle}>{course.id}</TableCell>
                    <TableCell style={centerRowStyle}>{course.course_name.toUpperCase()}</TableCell>
                    <TableCell style={centerRowStyle}>{get(foundProfessor, 'name')}</TableCell>
                    <TableCell style={centerRowStyle}>
                      <Button onClick={() => viewStudents(course.students)}>
                        <VisibilityIcon />
                      </Button>
                    </TableCell>
                    <TableCell style={centerRowStyle}>
                      <Button variant="outlined" onClick={() => handleEditClick(course)}><EditIcon /></Button>
                      <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleEditClick(course)}><DeleteIcon /></Button>
                    </TableCell>
                  </TableRow>
                  {selectedCourse && professorsList && studentsList && (
                    <ModalEditCourse
                      handleOpen={openEditModal}
                      handleCancel={() => setOpenEditModal(false)}
                      course={selectedCourse}
                      professorsList={professorsList}
                      studentsList={studentsList}
                    />
                  )}

                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {studentsList && (
        <ModalStudents
          handleOpen={openStudentModal}
          handleCancel={() => setOpenStudentModal(false)}
          studentsList={studentsList}
          studentsIds={studentsIds}
        />
      )}

    </>
  );
};

export default Courses;
