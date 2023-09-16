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
import type {
  Course,
  Grade,
  Student,
} from '../types';
import { URL_BACKEND } from '../constants';
import { filterCourses, filterStudents } from '../utils';

  type EditGradeModalProps = {
      handleOpen: boolean,
      handleCancel: () => void,
      refresh: () => void,
      gradeInfo: Grade,
      studentsList: Student[],
      courseList: Course[],
  }

const { Item } = Form;
const ModalEditGrade: FC<EditGradeModalProps> = ({
  handleOpen,
  handleCancel,
  gradeInfo,
  studentsList,
  courseList,
  refresh,
}) => {
  const [modalForm] = Form.useForm();
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [errorResponse, setErrorResponse] = useState <string>('');

  const onFinish = async () => {
    const values = modalForm.getFieldsValue();
    try {
      const res = await axios.put(`${URL_BACKEND}/api/grades/${values.id}/`, values);
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
    if (gradeInfo) {
      const {
        id, student, course, grade,
      } = gradeInfo;

      modalForm.setFieldsValue({
        id,
        student,
        course,
        grade,
      });
    }
  }, [gradeInfo]);

  return (
    <>
      {studentsList && (
        <Modal
          title="Update Grade"
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
              message="Grade Updated"
              description="Grade updated successfully"
              type="success"
              showIcon
            />
            <br />
          </>
          )}
          {showFailureResponse && (
          <>
            <Alert
              message="Grade Not Updated"
              description={`There was an error updating the grade. Error: ${errorResponse}`}
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
            <Item label="Course" name="course" rules={[{ required: true }]}>
              <Select
                disabled
                showSearch
                placeholder="Select course"
                optionFilterProp="children"
                filterOption={filterCourses}
                options={map(courseList, (course:Course) => ({
                  value: course.id,
                  label: course.course_name.toUpperCase(),
                }))}
              />
            </Item>
            <Item label="Student" name="student" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select student"
                optionFilterProp="children"
                filterOption={filterStudents}
                options={map(studentsList, (student:Student) => ({
                  value: student.id,
                  label: student.name,
                }))}
              />
            </Item>
            <Item label="Grade" name="grade" rules={[{ required: true }]}>
              <Input />
            </Item>
          </Form>
          )}
        </Modal>
      )}
    </>

  );
};

export default ModalEditGrade;
