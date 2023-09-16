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
import type { Course, Grade, Student } from '../../../types';
import { selectCourses, selectStudents } from '../../../redux/selectors/mainSelectors';
import { filterCourses, filterStudents } from '../../../utils';

const { Item } = Form;
const CreateGrade: NextPage = () => {
  const [form] = Form.useForm();
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const studentsList: Student[] = useSelector(selectStudents);
  const courseList: Course[] = useSelector(selectCourses);
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
        <Item label="Grade" name="grade" rules={[{ required: true }]}>
          <Input />
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
