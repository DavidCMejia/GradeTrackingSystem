import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { Paper, Grid, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TodayIcon from '@mui/icons-material/Today';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { selectUser } from '../../selectors/mainSelectors';
import { useRouter } from 'next/router';

const Dashboard: NextPage = () => {
  const userRedux = useSelector(selectUser);
  const { push } = useRouter();
  // console.log('🚀 ~ userRedux Dashboard:', userRedux);

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
          <Grid key="Hola" item>
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
