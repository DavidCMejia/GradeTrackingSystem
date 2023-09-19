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
import type { Course, Professor, Student } from '../types';
import { URL_BACKEND } from '../constants';
import { filterProfessors, filterStudents } from '../utils';

type EditCourseModalProps = {
    handleOpen: boolean,
    handleCancel: () => void,
    course: Course,
    professorsList:Professor[],
    studentsList: Student[],
    refresh: () => void,
}

const { Item } = Form;
const ModalEditCourse: FC<EditCourseModalProps> = ({
  handleOpen,
  handleCancel,
  professorsList,
  studentsList,
  course,
  refresh,
}) => {
  const [modalForm] = Form.useForm();
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [errorResponse, setErrorResponse] = useState <string>('');

  const onFinish = async () => {
    const values = modalForm.getFieldsValue();
    try {
      const res = await axios.put(`${URL_BACKEND}/api/courses/${values.id}/`, values);

      if (res && res.status === 200) {
        map(values.students, async (studentId) => {
          const foundStudent = studentsList.find((student) => student.id === studentId);
          if (foundStudent) {
            await axios.patch(`${URL_BACKEND}/api/students/${studentId}/`, {
              courses_enrolled: [...foundStudent.courses_enrolled, res.data.id],
            });
          }
        });

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
    if (course) {
      const {
        id, course_name, course_code, professor, students,
      } = course;

      modalForm.setFieldsValue({
        id,
        course_name,
        course_code,
        professor,
        students,
      });
    }
  }, [course]);

  return (
    <>
      {professorsList && studentsList && (
      <Modal
        title="Update Course"
        open={handleOpen}
        onCancel={handleCancel}
        onOk={() => {
          modalForm.validateFields()
            .then(() => modalForm.submit())
            .catch();
        }}
      >
        {showSucessResponse && (
        <>
          <Alert
            message="Course Updated"
            description={`${course.course_name.toUpperCase()} successfully updated`}
            type="success"
            showIcon
          />
          <br />
        </>
        )}
        {showFailureResponse && (
        <>
          <Alert
            message="Course Not Updated"
            description={`There was an error updating ${course.course_name.toUpperCase()}, error: ${errorResponse}`}
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
          <Item label="Code" name="course_code">
            <Input />
          </Item>
          <Item label="Name" name="course_name" rules={[{ required: true }]}>
            <Input />
          </Item>
          <Item label="Professor" name="professor" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Select a professor"
              optionFilterProp="children"
              filterOption={filterProfessors}
              options={map(professorsList, (professor:Professor) => ({
                value: professor.id,
                label: professor.name,
              }))}
            />
          </Item>
          <Item label="Students" name="students">
            <Select
              showSearch
              mode="multiple"
              placeholder="Select students"
              optionFilterProp="children"
              filterOption={filterStudents}
              options={map(studentsList, (student:Student) => ({
                value: student.id,
                label: student.name,
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

export default ModalEditCourse;
