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
import { URL_BACKEND, roleOptionsSelect } from '../../../constants';
import type { Course, Student } from '../../../types';
import { selectCourses } from '../../../selectors/mainSelectors';
import { filterCourses } from '../../../utils';

const { Item } = Form;
const CreateStudent: NextPage = () => {
  const [form] = Form.useForm();
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const courseList: Course[] = useSelector(selectCourses);
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Student created successfully',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  const onFinish = async (values: Student) => {
    try {
      const res = await axios.post(`${URL_BACKEND}/api/students/`, values);
      if (res && res.status === 201) success();
    } catch (error: any) {
      message.error(error.toString());
    }
    form.resetFields();
    push('/dashboard/students');
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
        Create Student
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
        <Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Item>
      </Form>

    </TableContainer>
  );
};

export default CreateStudent;
