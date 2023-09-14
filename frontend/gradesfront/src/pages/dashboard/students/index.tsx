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
import VisibilityIcon from '@mui/icons-material/Visibility';
import Add from '@mui/icons-material/Add';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { URL_BACKEND } from '../../../constants';
import type { Course, Professor, Student } from '../../../types';

import ModalCourses from '../../../components/modalCourses';
import ModalEditCourse from '../../../components/modalEditCourse';
import { selectCourses, selectProfessors } from '../../../selectors/mainSelectors';

const Courses: NextPage = () => {
  const [studentsData, setStudentsData] = useState<Student[]>();
  const [openCoursesModal, setOpenCoursesModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [coursesIds, setCoursesIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();

  const professorsList: Professor[] = useSelector(selectProfessors);
  const coursesList: Course[] = useSelector(selectCourses);

  const { push, asPath } = useRouter();
  // TODO: Poner name required en create student

  const sortedStudentssData = orderBy(studentsData, 'name', 'asc');
  const searchTextLower = searchText.toLowerCase();
  const filteredData: Student[] = sortedStudentssData
    .filter(
      ({
        name,
        identification_number,
        student_number,
      }) => name.toLowerCase().includes(searchTextLower)
    || identification_number.toLowerCase().includes(searchTextLower)
    || student_number?.toString().toLowerCase().includes(searchTextLower),
    );

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Student deleted successfully',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  const fetchStudents = () => {
    axios.get(`${URL_BACKEND}/api/students/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setStudentsData(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const handleEditClick = (row: Student) => {
    setOpenEditModal(true);
    setSelectedStudent(row);
  };

  const handleDeleteClick = (row: Student) => {
    axios.delete(`${URL_BACKEND}/api/students/${row.id}/`)
      .then((res) => {
        if (res && res.status === 204) {
          success();
          fetchStudents();
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const viewCourses = (cIds: number[]) => {
    setCoursesIds(cIds);
    setOpenCoursesModal(true);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (isEmpty(studentsData)) {
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
        Students
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
            marginBottom: '20px', marginTop: '20px', maxWidth: '100px', minWidth: '750px',
          }}
        />
      </Typography>
      {contextHolder}
      <TableContainer
        component={Paper}
        style={{
          border: '1px solid #ccc', margin: 'auto', maxWidth: '100px', minWidth: '750px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={rowTitleStyle}>id</TableCell>
              {/* <TableCell style={rowTitleStyle}>#</TableCell> */}
              <TableCell style={rowTitleStyle}>Identification</TableCell>
              <TableCell style={rowTitleStyle}>Name</TableCell>
              <TableCell style={rowTitleStyle}>Role</TableCell>
              <TableCell style={rowTitleStyle}>Email</TableCell>
              <TableCell style={rowTitleStyle}>Courses</TableCell>
              <TableCell style={rowTitleStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && map(filteredData, (student) => {
              const foundRole = studentsData
              && find(studentsData, { role: student.role });

              return (
                <TableRow key={student.id}>
                  <TableCell style={centerRowStyle}>{student.id}</TableCell>
                  {/* <TableCell style={centerRowStyle}>{student.student_number}</TableCell> */}
                  <TableCell style={centerRowStyle}>{student.identification_number}</TableCell>
                  <TableCell style={centerRowStyle}>{student.name}</TableCell>
                  {/* <TableCell style={centerRowStyle}>{get(foundRole, 'name')}</TableCell> */}
                  <TableCell style={centerRowStyle}>{student.role}</TableCell>
                  <TableCell style={centerRowStyle}>{student.email}</TableCell>
                  <TableCell style={centerRowStyle}>
                    <Button onClick={() => viewCourses(student.courses_enrolled)}>
                      <VisibilityIcon />
                    </Button>
                  </TableCell>
                  <TableCell style={centerRowStyle}>
                    <Button variant="outlined" onClick={() => handleEditClick(student)}><EditIcon /></Button>
                    <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleDeleteClick(student)}><DeleteIcon /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {coursesList && (
        <ModalCourses
          handleOpen={openCoursesModal}
          handleCancel={() => setOpenCoursesModal(false)}
          coursesList={coursesList}
          coursesIds={coursesIds}
        />
      )}

{/* 
      {selectedCourse && professorsList && studentsList && (
      <ModalEditCourse
        handleOpen={openEditModal}
        handleCancel={() => setOpenEditModal(false)}
        refresh={fetchCourses}
        course={selectedCourse}
        professorsList={professorsList}
        studentsList={studentsList}
      />
      )} */}

    </>
  );
};

export default Courses;
