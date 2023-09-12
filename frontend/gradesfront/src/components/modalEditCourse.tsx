/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
import {
  Form, Input, Modal, Select,
} from 'antd';
import { FC, useEffect } from 'react';
import {
  Collection, flatten, map,
} from 'lodash';
import type { Course, Professor, Student } from '../types';

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
  const flatProfessorsList: Professor[] = flatten(professorsList as any);
  const flatStudentsList: Student[] = flatten(studentsList as any);

  const filterProfessors = (input: string, option: any) => {
    const { label } = option;
    return label.toLowerCase().includes(input.toLowerCase());
  };
  const filterStudents = (input: string, option: any) => {
    const { label } = option;
    return label.toLowerCase().includes(input.toLowerCase());
  };

  const onFinish = () => {
    console.log('Editando curso', modalForm.getFieldsValue());
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
