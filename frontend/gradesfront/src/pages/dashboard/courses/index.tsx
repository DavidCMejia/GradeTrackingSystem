/* eslint-disable react/jsx-no-useless-fragment */
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import Add from '@mui/icons-material/Add';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { PROFESSOR_ROLE, STUDENT_ROLE, URL_BACKEND } from '../../../constants';
import type { Course, Professor, Student } from '../../../types';

import ModalStudents from '../../../components/modalStudents';
import ModalEditCourse from '../../../components/modalEditCourse';
import { selectProfessors, selectStudents, selectUser } from '../../../redux/selectors/mainSelectors';

const Courses: NextPage = () => {
  const [coursesData, setCoursesData] = useState<Course[]>();
  const [openStudentModal, setOpenStudentModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [studentsIds, setStudentsIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();

  const studentsList: Student[] = useSelector(selectStudents);
  const professorsList: Professor[] = useSelector(selectProfessors);
  const userRedux = useSelector(selectUser);
  const { push, asPath } = useRouter();

  const sortedCoursesData = orderBy(coursesData, 'course_code', 'asc');
  const searchTextLower = searchText.toLowerCase();
  const filteredData: Course[] = sortedCoursesData
    .filter(
      ({
        course_name,
        course_code,
        professor,
      }) => course_name.toLowerCase().includes(searchTextLower)
    || course_code.toLowerCase().includes(searchTextLower)
    || professor.toString().toLowerCase().includes(searchTextLower),
    );

  const success = (actionType: string) => {
    messageApi.open({
      type: 'success',
      content: `Course ${actionType} successfully`,
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  const fetchCourses = () => {
    axios.get(`${URL_BACKEND}/api/courses/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          if (userRedux.role === PROFESSOR_ROLE && !userRedux.admin) {
            const filteredCourses = res.data.filter(
              (course: Course) => course.professor === userRedux.id,
            );
            setCoursesData(filteredCourses);
          } else {
            setCoursesData(res.data);
          }
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const handleEnrollClick = (row: Course) => {
    axios.patch(`${URL_BACKEND}/api/courses/${row.id}/`, {
      students: [...row.students, userRedux.id],
    })
      .then((res) => {
        if (res && res.status === 200) {
          success('enrolled');
          fetchCourses();
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const handleUnenrollClick = (row: Course) => {
    const removeStudent = row.students.filter((student) => student !== userRedux.id);
    axios.patch(`${URL_BACKEND}/api/courses/${row.id}/`, {
      students: removeStudent,
    })
      .then((res) => {
        if (res && res.status === 200) {
          success('unenrolled');
          fetchCourses();
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const handleEditClick = (row: Course) => {
    setOpenEditModal(true);
    setSelectedCourse(row);
  };

  const handleDeleteClick = (row: Course) => {
    axios.delete(`${URL_BACKEND}/api/courses/${row.id}/`)
      .then((res) => {
        if (res && res.status === 204) {
          success('deleted');
          fetchCourses();
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const viewStudents = (sIds: number[]) => {
    setStudentsIds(sIds);
    setOpenStudentModal(true);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isEmpty(coursesData)) {
    return (
      <Typography variant="h3" align="center" gutterBottom>
        {userRedux.role === PROFESSOR_ROLE ? (
          <>
            There are no courses created. Click to create a course
            <br />
            <Button variant="outlined" color="success" onClick={() => push(`${asPath}/create`)}><Add /></Button>
          </>
        ) : (
          <span>There are no courses created. Please contact the administrator.</span>)}
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
        Courses
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
              <TableCell style={rowTitleStyle}>Code</TableCell>
              <TableCell style={rowTitleStyle}>id</TableCell>
              <TableCell style={rowTitleStyle}>Name</TableCell>
              <TableCell style={rowTitleStyle}>Professor</TableCell>
              <TableCell style={rowTitleStyle}>Students</TableCell>
              <TableCell style={rowTitleStyle}>{userRedux.role === PROFESSOR_ROLE ? 'Action' : 'Enroll'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && map(filteredData, (course) => {
              const foundProfessor = professorsList
              && find(professorsList, { id: course.professor });

              return (
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
                    {userRedux.role === PROFESSOR_ROLE && (
                    <>
                      <Button variant="outlined" onClick={() => handleEditClick(course)}><EditIcon /></Button>
                      <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleDeleteClick(course)}><DeleteIcon /></Button>
                    </>
                    )}
                    {userRedux.role === STUDENT_ROLE && (
                      <>
                        {userRedux.id && course.students.includes(userRedux.id) ? (
                        // studentEnrolled
                          <Button variant="outlined" onClick={() => handleUnenrollClick(course)}><CheckCircleIcon /></Button>
                        ) : (
                        // studentNotEnrolled
                          <Button variant="outlined" onClick={() => handleEnrollClick(course)}><RadioButtonUncheckedIcon /></Button>
                        )}
                      </>
                    )}

                  </TableCell>
                </TableRow>
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

      {selectedCourse && professorsList && studentsList && (
      <ModalEditCourse
        handleOpen={openEditModal}
        handleCancel={() => setOpenEditModal(false)}
        refresh={fetchCourses}
        course={selectedCourse}
        professorsList={professorsList}
        studentsList={studentsList}
      />
      )}

    </>
  );
};

export default Courses;
