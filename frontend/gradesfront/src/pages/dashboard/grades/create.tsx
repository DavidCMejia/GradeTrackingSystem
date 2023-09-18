import {
  Button,
  Form, Input, Select, message,
} from 'antd';
import { NextPage } from 'next';
import axios from 'axios';
import { isNaN, map } from 'lodash';
import { TableContainer, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PROFESSOR_ROLE, URL_BACKEND } from '../../../constants';
import type { Course, Grade, Student } from '../../../types';
import { selectCourses, selectStudents, selectUser } from '../../../redux/selectors/mainSelectors';
import { filterCourses, filterStudents } from '../../../utils';

const { Item } = Form;
const CreateGrade: NextPage = () => {
  const [form] = Form.useForm();
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const studentsList: Student[] = useSelector(selectStudents);
  const courseList: Course[] = useSelector(selectCourses);
  const userRedux = useSelector(selectUser);
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

  const onFinish = async (values: Grade) => {
    try {
      const res = await axios.post(`${URL_BACKEND}/api/grades/`, values);
      if (res && res.status === 201) success();
    } catch (error: any) {
      message.error(error.toString());
    }
    form.resetFields();
    setTimeout(() => {
      push('/dashboard/grades');
    }, 2500);
  };

  useEffect(() => {
    if (userRedux.role !== PROFESSOR_ROLE) {
      message.error('You are not allowed to access this page, please contact the administrator');
      push('/dashboard');
    }
  }, [userRedux]);

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
        Create Grade
      </Typography>
      <br />
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
      >
        <Item label="id" name="id" hidden>
          <Input />
        </Item>
        <Item label="Course" name="course" rules={[{ required: true }]}>
          <Select
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
        <Item
          label="Grade"
          name="grade"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa una calificación.',
            },
            {
              validator: async (rule, value) => {
                const numericValue = parseFloat(value);
                if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
                  throw new Error('Please, enter a valid grade between 1 and 100.');
                }
              },
            },
          ]}
        >
          <Input placeholder="75" />
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

export default CreateGrade;
