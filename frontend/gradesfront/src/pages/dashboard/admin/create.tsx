/* eslint-disable react/jsx-boolean-value */
import {
  Button,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import { NextPage } from 'next';
import axios from 'axios';
import { TableContainer, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PROFESSOR_ROLE, URL_BACKEND } from '../../../constants';
import type { Student } from '../../../types';
import { selectUser } from '../../../redux/selectors/mainSelectors';

const { Item } = Form;
const { Option } = Select;
const CreateUser: NextPage = () => {
  const [form] = Form.useForm();
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const userRedux = useSelector(selectUser);
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'User created successfully',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  const onFinish = async (values: Student) => {
    try {
      const res = await axios.post(`${URL_BACKEND}/api/users/`, values);

      if (res && res.status === 201) success();
    } catch (error: any) {
      message.error(error.toString());
    }
    form.resetFields();
    setTimeout(() => {
      push('/dashboard/admin');
    }, 2500);
  };

  useEffect(() => {
    if (userRedux.role !== PROFESSOR_ROLE) {
      message.error('You are not allowed to access this page, please contact the administrator.');
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
        Create User
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
        <Item label="Identification" name="identification_number" rules={[{ required: true }]}>
          <Input />
        </Item>
        <Item label="Name" name="name">
          <Input />
        </Item>
        <Item label="Email" name="email" rules={[{ type: 'email', required: true }]}>
          <Input />
        </Item>
        <Item label="Status" name="status">
          <Select>
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </Item>
        <Item label="Professor" name="professor_id" hidden>
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

export default CreateUser;
