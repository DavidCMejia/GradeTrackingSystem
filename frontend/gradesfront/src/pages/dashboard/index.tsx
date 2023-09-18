import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Grid, Typography } from '@mui/material';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TodayIcon from '@mui/icons-material/Today';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import GradingIcon from '@mui/icons-material/Grading';

import axios from 'axios';

import { isEmpty } from 'lodash';
import { message } from 'antd';
import { useEffect } from 'react';
import { selectUser } from '../../redux/selectors/mainSelectors';

import { setStudents } from '../../redux/slices/studentsSlice';
import { setProfessors } from '../../redux/slices/professorsSlice';
import { setCourses } from '../../redux/slices/coursesSlice';

import { PROFESSOR_ROLE, URL_BACKEND } from '../../constants';

const Dashboard: NextPage = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector(selectUser);
  const { push } = useRouter();

  const fetchCourses = () => {
    axios.get(`${URL_BACKEND}/api/courses/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          dispatch(setCourses(res.data));
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const fetchStudents = () => {
    axios.get(`${URL_BACKEND}/api/students/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          dispatch(setStudents(res.data));
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const fetchProfessors = () => {
    axios.get(`${URL_BACKEND}/api/professors/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          dispatch(setProfessors(res.data));
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

  const paperStyles = {
    p: 2,
    height: 100,
    width: 100,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: 'lightgray',
    },
  };

  return (
    <>
      <br />
      <br />
      <br />
      <br />

      <Typography textAlign="center" fontSize={25}>
        Please select an option
      </Typography>
      <br />
      <Grid sx={{ flexGrow: 1 }} container spacing={2} item xs={12}>
        <Grid container justifyContent="center" spacing={8} sx={{ p: 2 }}>
          <Grid key="course" item>
            <Paper
              sx={paperStyles}
              onClick={() => push('/dashboard/courses')}
            >
              <Typography textAlign="center" fontSize={25}>
                <AutoStoriesIcon fontSize="large" />
                <br />
                Courses
              </Typography>
            </Paper>
          </Grid>
          {userRedux.role === PROFESSOR_ROLE && (
          <Grid key="student" item>
            <Paper
              sx={paperStyles}
              onClick={() => push('/dashboard/students')}
            >
              <Typography textAlign="center" fontSize={25}>
                <PermContactCalendarIcon fontSize="large" />
                <br />
                Students
              </Typography>
            </Paper>
          </Grid>
          )}
          <Grid key="schedule" item>
            <Paper
              sx={paperStyles}
              onClick={() => push('/dashboard/schedule')}
            >
              <Typography textAlign="center" fontSize={25}>
                <TodayIcon fontSize="large" />
                <br />
                Schedule
              </Typography>
            </Paper>
          </Grid>
          <Grid key="grades" item>
            <Paper
              sx={paperStyles}
              onClick={() => push('/dashboard/grades')}
            >
              <Typography textAlign="center" fontSize={25}>
                <GradingIcon fontSize="large" />
                <br />
                Grades
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

    </>
  );
};

export default Dashboard;
