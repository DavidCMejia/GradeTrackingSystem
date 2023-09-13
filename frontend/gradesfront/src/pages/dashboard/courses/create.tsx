import {
  Button,
  Form, Input, Select, message,
} from 'antd';
import { NextPage } from 'next';
import axios from 'axios';
import { map } from 'lodash';
import { TableContainer, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { URL_BACKEND } from '../../../constants';
import type { Professor, Student } from '../../../types';
import { selectProfessors, selectStudents } from '../../../selectors/mainSelectors';

const { Item } = Form;
const CreateCourse: NextPage = () => {
  const [modalForm] = Form.useForm();
  const studentsList: Student[] = useSelector(selectStudents);
  const professorsList: Professor[] = useSelector(selectProfessors);

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
      const res = await axios.post(`${URL_BACKEND}/api/courses/`, values);
      if (res && res.status === 200) message.success('Course created successfully');
    } catch (error: any) {
      message.error(error.toString());
    }
  };

  return (

    <TableContainer
      component={Paper}
      style={{
        border: '1px solid #ccc', margin: 'auto', maxWidth: '100px', minWidth: '600px',
      }}
    >
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Create Course
      </Typography>
      <br />
      <Form
        form={modalForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        title="Create Course"
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
        <Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Item>
      </Form>

    </TableContainer>
  );
};

export default CreateCourse;
