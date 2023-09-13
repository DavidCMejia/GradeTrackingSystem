import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Grid, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TodayIcon from '@mui/icons-material/Today';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { isEmpty } from 'lodash';
import { message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { selectUser } from '../../selectors/mainSelectors';

import { setStudents } from '../../slices/studentsSlice';
import { setProfessors } from '../../slices/professorsSlice';
import { setCourses } from '../../slices/coursesSlice';
import { URL_BACKEND } from '../../constants';

const Dashboard: NextPage = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector(selectUser);
  const { push } = useRouter();
  // console.log('🚀 ~ userRedux Dashboard:', userRedux);

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
              sx={{
                p: 2,
                height: 140,
                width: 100,
              }}
              onClick={() => push('/dashboard/courses')}
            >
              <Typography textAlign="center" fontSize={25}>
                <AutoStoriesIcon fontSize="large" />
                <br />
                Create Course
              </Typography>
            </Paper>
          </Grid>
          <Grid key="student" item>
            <Paper
              sx={{
                p: 2,
                height: 140,
                width: 100,
              }}
              onClick={() => push('/dashboard/students')}
            >
              <Typography textAlign="center" fontSize={25}>
                <PermContactCalendarIcon fontSize="large" />
                <br />
                Create Student
              </Typography>
            </Paper>
          </Grid>
          <Grid key="schedule" item>
            <Paper
              sx={{
                p: 2,
                height: 140,
                width: 100,
              }}
              onClick={() => push('/dashboard/schedule')}
            >
              <Typography textAlign="center" fontSize={25}>
                <TodayIcon fontSize="large" />
                <br />
                Schedule Class
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

    </>
  );
};

export default Dashboard;
