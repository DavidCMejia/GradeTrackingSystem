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
  CircularProgress,
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

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { URL_BACKEND } from '../../../constants';
import type {
  Course, Grade, Student,
} from '../../../types';

import { selectCourses, selectStudents } from '../../../selectors/mainSelectors';
import ModalEditGrade from '../../../components/modalEditGrade';

const Grades: NextPage = () => {
  const [gradesData, setGradesData] = useState<Grade[]>();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>();
  const [searchText, setSearchText] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();

  const studentsList: Student[] = useSelector(selectStudents);
  const courseList: Course[] = useSelector(selectCourses);

  const { push, asPath } = useRouter();

  const sortedCoursesData = orderBy(gradesData, 'student', 'asc');
  const searchTextLower = searchText.toLowerCase();

  const filteredData: Grade[] = sortedCoursesData
    .filter(({ student, course }) => {
      const foundStudent = studentsList.find((studentItem) => studentItem.id === student);
      const foundCourse = courseList.find((courseItem) => courseItem.id === course);
      return foundStudent?.name.toLowerCase().includes(searchTextLower)
      || foundCourse?.course_name.toLowerCase().includes(searchTextLower);
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
          setGradesData(res.data);
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

  useEffect(() => {
    fetchGrades();
  }, []);

  if (isEmpty(gradesData)) {
    return (
      <Typography variant="h3" align="center" gutterBottom>
        <CircularProgress />
        Loading...
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
        <Button variant="outlined" color="success" onClick={() => push(`${asPath}/create`)}><Add /></Button>
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
              <TableCell style={rowTitleStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && map(filteredData, (grade) => {
              const foundStudent = studentsList
              && find(studentsList, { id: grade.student });
              const foundCourse = courseList
              && find(courseList, { id: grade.course });

              return (
                <TableRow key={grade.id}>
                  {/* <TableCell style={centerRowStyle}>{grade.id}</TableCell> */}
                  <TableCell style={centerRowStyle}>{get(foundCourse, 'course_name')?.toUpperCase()}</TableCell>
                  <TableCell style={centerRowStyle}>{get(foundStudent, 'name')}</TableCell>
                  <TableCell style={centerRowStyle}>{grade.grade}</TableCell>
                  <TableCell style={centerRowStyle}>
                    <Button variant="outlined" onClick={() => handleEditClick(grade)}><EditIcon /></Button>
                    <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleDeleteClick(grade)}><DeleteIcon /></Button>
                  </TableCell>
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
