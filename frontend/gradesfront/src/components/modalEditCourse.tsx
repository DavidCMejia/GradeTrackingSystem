/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
import {
  Alert,
  Form,
  Input,
  Modal,
  Select,
} from 'antd';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import {
  Collection, flatten, map,
} from 'lodash';
import axios from 'axios';
import type { Course, Professor, Student } from '../types';
import { URL_BACKEND } from '../constants';

type EditCourseModalProps = {
    handleOpen: boolean,
    handleCancel: () => void,
    course: Course,
    professorsList: Collection<Professor[]>,
    studentsList: Collection<Student[]>,
}

const { Item } = Form;
const ModalEditCourse: FC<EditCourseModalProps> = ({
  handleOpen,
  handleCancel,
  professorsList,
  studentsList,
  course,
}) => {
  const [modalForm] = Form.useForm();
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [errorResponse, setErrorResponse] = useState <string>('');
  const flatProfessorsList: Professor[] = flatten(professorsList as any);
  const flatStudentsList: Student[] = flatten(studentsList as any);
  const { reload } = useRouter();

  const filterProfessors = (input: string, option: any) => {
    const { label } = option;
    return label.toLowerCase().includes(input.toLowerCase());
  };
  const filterStudents = (input: string, option: any) => {
    const { label } = option;
    return label.toLowerCase().includes(input.toLowerCase());
  };

  const onFinish = async () => {
    const values = modalForm.getFieldsValue();
    try {
      const res = await axios.put(`${URL_BACKEND}/api/courses/${values.id}/`, values);
      if (res && res.status === 200) {
        setShowSucessResponse(true);
        setTimeout(() => {
          setShowSucessResponse(false);
          reload();
        }, 3000);
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
      {flatProfessorsList && flatStudentsList && (
      <Modal
        title="Update Course"
        open={handleOpen}
        onCancel={handleCancel}
        onOk={modalForm.submit}
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
          <Item
            label="Name"
            name="course_name"
          >
            <Input />
          </Item>
          <Item label="Professor" name="professor">
            <Select
              showSearch
              placeholder="Select a professor"
              optionFilterProp="children"
              filterOption={filterProfessors}
              options={map(flatProfessorsList, (professor:Professor) => ({
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
              options={map(flatStudentsList, (student:Student) => ({
                value: student.id,
                label: student.name,
              }))}
            />
          </Item>
        </Form>
      </Modal>
      )}
    </>

  );
};

export default ModalEditCourse;
