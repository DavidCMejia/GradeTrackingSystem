import { Modal } from 'antd';
import { FC } from 'react';
import {
  ListItem,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Collection, find, isEmpty } from 'lodash';
import { Student } from '../types';

type StudentModalProps = {
    handleOpen: boolean,
    studentsList: Collection<Student[]>,
    studentsIds: number[],
    handleCancel: () => void,
}

const ModalStudents: FC<StudentModalProps> = ({
  handleOpen,
  handleCancel,
  studentsList,
  studentsIds,
}) => (
  <Modal
    title="Students Enrolled"
    open={handleOpen}
    onCancel={handleCancel}
    footer={null}
  >
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {isEmpty(studentsIds) && (
      <ListItem>
        <ErrorOutlineIcon style={{ marginRight: '20px' }} />
        <ListItemText
          primary="No students enrolled in this course yet"
        />
      </ListItem>
      )}

      {studentsList && studentsIds.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        const studentSelected = find(studentsList, { id: value });
        return (
          <ListItem
            key={value}
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${studentSelected?.name}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

  </Modal>
);

export default ModalStudents;
