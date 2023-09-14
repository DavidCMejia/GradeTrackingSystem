/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
import {
  Alert,
  Form,
  Input,
  Modal,
  Select,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { map } from 'lodash';
import axios from 'axios';
import type { Course, Student } from '../types';
import { URL_BACKEND, roleOptionsSelect } from '../constants';
import { filterCourses } from '../utils';

type EditCourseModalProps = {
    handleOpen: boolean,
    handleCancel: () => void,
    student: Student,
    courseList: Course[],
    studentsList: Student[],
    refresh: () => void,
}

const { Item } = Form;
const ModalEditStudent: FC<EditCourseModalProps> = ({
  handleOpen,
  handleCancel,
  courseList,
  studentsList,
  student,
  refresh,
}) => {
  const [modalForm] = Form.useForm();
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [errorResponse, setErrorResponse] = useState <string>('');

  const onFinish = async () => {
    const values = modalForm.getFieldsValue();
    try {
      const res = await axios.put(`${URL_BACKEND}/api/students/${values.id}/`, values);
      if (res && res.status === 200) {
        setShowSucessResponse(true);
        setTimeout(() => {
          setShowSucessResponse(false);
        }, 3000);
        refresh();
      }
    } catch (error: any) {
      setErrorResponse(error.message);
      setShowFailureResponse(true);
      setTimeout(() => {
        setShowFailureResponse(false);
      }, 4000);
    }
  };

  useEffect(() => {
    if (student) {
      const {
        id, student_number, identification_number, name, role, email, courses_enrolled,
      } = student;

      modalForm.setFieldsValue({
        id,
        student_number,
        identification_number,
        name,
        role,
        email,
        courses_enrolled,
      });
    }
  }, [student]);

  return (
    <>
      {courseList && studentsList && (
      <Modal
        title="Update Student"
        open={handleOpen}
        onCancel={handleCancel}
        onOk={modalForm.submit}
      >
        {showSucessResponse && (
        <>
          <Alert
            message="Student Updated"
            description={`${student.name.toUpperCase()} successfully updated`}
            type="success"
            showIcon
          />
          <br />
        </>
        )}
        {showFailureResponse && (
        <>
          <Alert
            message="Student Not Updated"
            description={`There was an error updating ${student.name.toUpperCase()}, error: ${errorResponse}`}
            type="error"
            showIcon
          />
          <br />
        </>
        )}
        {!showSucessResponse && (
        <Form
          form={modalForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
        >
          <Item label="id" name="id" hidden>
            <Input />
          </Item>
          <Item label="#" name="student_number" hidden>
            <Input />
          </Item>
          <Item label="Identification" name="identification_number">
            <Input />
          </Item>
          <Item
            label="Name"
            name="name"
          >
            <Input />
          </Item>
          <Item label="Role" name="role">
            <Select
              placeholder="Select role"
              defaultValue={roleOptionsSelect[1]}
              options={roleOptionsSelect}
            />
          </Item>
          <Item label="Email" name="email">
            <Input />
          </Item>
          <Item label="Courses" name="courses_enrolled">
            <Select
              showSearch
              mode="multiple"
              placeholder="Select course"
              optionFilterProp="children"
              filterOption={filterCourses}
              options={map(courseList, (course:Course) => ({
                value: course.id,
                label: course.course_name.toUpperCase(),
              }))}
            />
          </Item>
        </Form>
        )}
      </Modal>
      )}
    </>

  );
};

export default ModalEditStudent;
