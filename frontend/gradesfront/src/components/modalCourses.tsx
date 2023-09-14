import { Modal } from 'antd';
import { FC } from 'react';
import {
  ListItem,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  find,
  get,
  isEmpty,
} from 'lodash';
import type { Course } from '../types';

type CourseModalProps = {
    handleOpen: boolean,
    coursesList: Course[],
    coursesIds: number[],
    handleCancel: () => void,
}

const ModalCourses: FC<CourseModalProps> = ({
  handleOpen,
  handleCancel,
  coursesList,
  coursesIds,
}) => (
  <Modal
    title="Courses Enrolled"
    open={handleOpen}
    onCancel={handleCancel}
    footer={null}
  >
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {isEmpty(coursesIds) && (
      <ListItem>
        <ErrorOutlineIcon style={{ marginRight: '20px' }} />
        <ListItemText
          primary="No courses enrolled yet"
        />
      </ListItem>
      )}

      {coursesList && coursesIds && coursesIds.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        const courseSelected = find(coursesList, { id: value });
        return (
          <ListItem
            key={value}
            disablePadding
          >
            <ListItemButton>
              <ListItemText id={labelId} primary={`${get(courseSelected, 'course_name')?.toUpperCase()}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

  </Modal>
);

export default ModalCourses;
