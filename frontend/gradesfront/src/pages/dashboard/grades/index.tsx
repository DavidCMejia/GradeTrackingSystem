/* eslint-disable camelcase */
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
  TextField,
} from '@mui/material';

import { message } from 'antd';

import {
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
import Add from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { PROFESSOR_ROLE, STUDENT_ROLE, URL_BACKEND } from '../../../constants';
import type {
  Course, Grade, Student,
} from '../../../types';

import { selectCourses, selectStudents, selectUser } from '../../../redux/selectors/mainSelectors';
import ModalEditGrade from '../../../components/modalEditGrade';

const Grades: NextPage = () => {
  const [gradesData, setGradesData] = useState<Grade[]>();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>();
  const [searchText, setSearchText] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();

  const studentsList: Student[] = useSelector(selectStudents);
  const courseList: Course[] = useSelector(selectCourses);
  const userRedux = useSelector(selectUser);

  const { push, asPath } = useRouter();

  const sortedCoursesData = orderBy(gradesData, 'student', 'asc');
  const searchTextLower = searchText.toLowerCase();

  const filteredData: Grade[] = sortedCoursesData
    .filter(({ student, course, grade }) => {
      const foundStudent = studentsList.find((studentItem) => studentItem.id === student);
      const foundCourse = courseList.find((courseItem) => courseItem.id === course);
      return foundStudent?.name.toLowerCase().includes(searchTextLower)
      || foundCourse?.course_name.toLowerCase().includes(searchTextLower)
      || grade.toString().includes(searchTextLower);
    });

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Grade deleted successfully',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  const fetchGrades = () => {
    axios.get(`${URL_BACKEND}/api/grades/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          if (userRedux.role === STUDENT_ROLE) {
            const filteredGrades = res.data.filter(
              (grade: Grade) => grade.student === userRedux.id,
            );
            setGradesData(filteredGrades);
          } else {
            setGradesData(res.data);
          }
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const handleEditClick = (row: Grade) => {
    setOpenEditModal(true);
    setSelectedGrade(row);
  };

  const handleDeleteClick = (row: Grade) => {
    axios.delete(`${URL_BACKEND}/api/grades/${row.id}/`)
      .then((res) => {
        if (res && res.status === 204) {
          success();
          fetchGrades();
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const getGradeColor = (gradeValue:number) => {
    if (gradeValue < 60) {
      return 'red'; // Rojo para notas menores a 60
    }
    if (gradeValue >= 60 && gradeValue < 80) {
      return 'orange'; // Amarillo para notas entre 60 y 80
    }
    if (gradeValue >= 80 && gradeValue <= 100) {
      return 'green'; // Verde para notas entre 80 y 100
    }
    return 'black'; // Color por defecto
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  if (isEmpty(gradesData)) {
    return (
      <Typography variant="h3" align="center" gutterBottom>
        <ErrorIcon fontSize="large" />
        {' '}
        The student
        {' '}
        {userRedux.name}
        {' '}
        has no grades yet
      </Typography>
    );
  }

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
        Grades
        <br />
        {userRedux.role === PROFESSOR_ROLE && (
        <Button variant="outlined" color="success" onClick={() => push(`${asPath}/create`)}><Add /></Button>
        )}
        <br />
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            marginBottom: '20px', marginTop: '20px', maxWidth: '100px', minWidth: '650px',
          }}
        />
      </Typography>
      {contextHolder}
      <TableContainer
        component={Paper}
        style={{
          border: '1px solid #ccc', margin: 'auto', maxWidth: '100px', minWidth: '650px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell style={rowTitleStyle}>id</TableCell> */}
              <TableCell style={rowTitleStyle}>Course</TableCell>
              <TableCell style={rowTitleStyle}>Student</TableCell>
              <TableCell style={rowTitleStyle}>Grade</TableCell>
              {userRedux.role === PROFESSOR_ROLE && (
              <TableCell style={rowTitleStyle}>Actions</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && map(filteredData, (grade) => {
              const foundStudent = studentsList
              && find(studentsList, { id: grade.student });
              const foundCourse = courseList
              && find(courseList, { id: grade.course });
              const gradeColor = getGradeColor(grade.grade);
              return (
                <TableRow key={grade.id}>
                  {/* <TableCell style={centerRowStyle}>{grade.id}</TableCell> */}
                  <TableCell style={centerRowStyle}>{get(foundCourse, 'course_name')?.toUpperCase()}</TableCell>
                  <TableCell style={centerRowStyle}>{get(foundStudent, 'name')}</TableCell>
                  <TableCell style={centerRowStyle}>
                    <span style={{ color: gradeColor }}>
                      {grade.grade}
                    </span>
                  </TableCell>
                  {userRedux.role === PROFESSOR_ROLE && (
                  <TableCell style={centerRowStyle}>
                    <Button variant="outlined" onClick={() => handleEditClick(grade)}><EditIcon /></Button>
                    <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleDeleteClick(grade)}><DeleteIcon /></Button>
                  </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedGrade && studentsList && (
      <ModalEditGrade
        handleOpen={openEditModal}
        handleCancel={() => setOpenEditModal(false)}
        refresh={fetchGrades}
        gradeInfo={selectedGrade}
        studentsList={studentsList}
        courseList={courseList}
      />
      )}

    </>
  );
};

export default Grades;
