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
  isEmpty,
  map,
  orderBy,
  upperFirst,
} from 'lodash';

import { CSSProperties, useEffect, useState } from 'react';
import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Add from '@mui/icons-material/Add';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { PROFESSOR_ROLE, URL_BACKEND, roles } from '../../../constants';
import type { Course, Student } from '../../../types';

import ModalCourses from '../../../components/modalCourses';
import ModalEditStudent from '../../../components/modalEditStudent';
import { selectCourses, selectUser } from '../../../redux/selectors/mainSelectors';

const Courses: NextPage = () => {
  const [studentsData, setStudentsData] = useState<Student[]>();
  const [openCoursesModal, setOpenCoursesModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [coursesIds, setCoursesIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const userRedux = useSelector(selectUser);

  const coursesList: Course[] = useSelector(selectCourses);

  const { push, asPath } = useRouter();

  const sortedStudentssData = orderBy(studentsData, 'name', 'asc');
  const searchTextLower = searchText.toLowerCase();
  const filteredData: Student[] = sortedStudentssData
    .filter(
      ({
        name,
        identification_number,
        email,
      }) => name.toLowerCase().includes(searchTextLower)
    || identification_number?.toLowerCase().includes(searchTextLower)
    || email?.toLowerCase().includes(searchTextLower),
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

  useEffect(() => {
    fetchStudents();
    if (userRedux.role !== PROFESSOR_ROLE) {
      message.error('You are not allowed to access this page, please contact the administrator.');
      push('/dashboard');
    }
  }, [userRedux]);

  if (isEmpty(studentsData)) {
    return (
      <Typography variant="h3" align="center" gutterBottom>
        There are no students created. Click to create a student
        <br />
        {userRedux.role === PROFESSOR_ROLE && (
        <Button variant="outlined" color="success" onClick={() => push(`${asPath}/create`)}><Add /></Button>
        )}
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
            marginBottom: '20px', marginTop: '20px', maxWidth: '100px', minWidth: '850px',
          }}
        />
      </Typography>
      {contextHolder}
      <TableContainer
        component={Paper}
        style={{
          border: '1px solid #ccc', margin: 'auto', maxWidth: '100px', minWidth: '850px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell style={rowTitleStyle}>id</TableCell> */}
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
              const foundRole = roles[Number(student.role)];

              return (
                <TableRow key={student.id}>
                  {/* <TableCell style={centerRowStyle}>{student.id}</TableCell> */}
                  {/* <TableCell style={centerRowStyle}>{student.student_number}</TableCell> */}
                  <TableCell style={centerRowStyle}>{student.identification_number}</TableCell>
                  <TableCell style={centerRowStyle}>{student.name}</TableCell>
                  <TableCell style={centerRowStyle}>{upperFirst(foundRole) || '--'}</TableCell>
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

      {selectedStudent && coursesList && studentsData && (
      <ModalEditStudent
        handleOpen={openEditModal}
        handleCancel={() => setOpenEditModal(false)}
        refresh={fetchStudents}
        student={selectedStudent}
        courseList={coursesList}
        studentsList={studentsData}
      />
      )}

    </>
  );
};

export default Courses;
