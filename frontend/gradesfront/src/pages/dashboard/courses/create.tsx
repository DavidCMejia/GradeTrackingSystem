import {
  Button,
  Form, Input, Select, message,
} from 'antd';
import { NextPage } from 'next';
import axios from 'axios';
import { map } from 'lodash';
import { TableContainer, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { URL_BACKEND } from '../../../constants';
import type { Course, Professor, Student } from '../../../types';
import { selectProfessors, selectStudents } from '../../../selectors/mainSelectors';
import { filterProfessors, filterStudents } from '../../../utils';

const { Item } = Form;
const CreateCourse: NextPage = () => {
  const [form] = Form.useForm();
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const studentsList: Student[] = useSelector(selectStudents);
  const professorsList: Professor[] = useSelector(selectProfessors);
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Course created successfully',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  const onFinish = async (values: Course) => {
    try {
      const res = await axios.post(`${URL_BACKEND}/api/courses/`, values);
      if (res && res.status === 201) success();
    } catch (error: any) {
      message.error(error.toString());
    }
    form.resetFields();
    setTimeout(() => {
      push('/dashboard/courses');
    }, 2500);
  };

  return (

    <TableContainer
      component={Paper}
      style={{
        border: '1px solid #ccc', margin: 'auto', maxWidth: '100px', minWidth: '650px',
      }}
    >
      {contextHolder}
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Create Course
      </Typography>
      <br />
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
      >
        <Item label="id" name="id" hidden>
          <Input />
        </Item>
        <Item label="Code" name="course_code">
          <Input placeholder="101" />
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
