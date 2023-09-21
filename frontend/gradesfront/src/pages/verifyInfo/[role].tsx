/* eslint-disable camelcase */
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  Container, Typography,
} from '@mui/material';

import {
  Form, Input, Button, message, Divider,
} from 'antd';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

import axios from 'axios';

import { first, isEmpty, pick } from 'lodash';

import { useDispatch } from 'react-redux';
import type { Professor, Student } from '../../types';

import { URL_BACKEND, roles } from '../../constants';
import { parseError } from '../../utils';
import { setUser } from '../../redux/slices/userSlice';

const VerifyInfo: NextPage = () => {
  const { query, push } = useRouter();
  const { user } = useUser();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataCheckedAlready, setDataCheckedAlready] = useState<boolean>(false);
  const [userData, setUserData] = useState<Professor | Student>();
  const [userRole, setUserRole] = useState<string>('');
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Information verified successfully',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  const handleUser = async (values: Professor | Student) => {
    const commonProperties = pick(values, ['identification_number', 'name', 'email']);
    const userDataWithRole = {
      ...commonProperties,
      [`${userRole.slice(0, -1)}_id`]: userData?.id,
    };
    if (!dataCheckedAlready) {
      await axios.get(`${URL_BACKEND}/api/users/by_email/${userData?.email}/`)
        .then((res) => axios.put(`${URL_BACKEND}/api/users/${res.data[0].id}/`, userDataWithRole))
        .catch();
    } else {
      await axios.post(`${URL_BACKEND}/api/users/`, userDataWithRole)
        .catch();
    }
  };

  const handleSubmit = async (values: Professor | Student) => {
    try {
      await handleUser(values);
      if (!dataCheckedAlready && userData && userRole) {
        const res = await axios.put(`${URL_BACKEND}/api/${userRole}/${userData?.id}/`, values);
        if (res && res.status === 200) success();
        const {
          id, name, email, role, identification_number, admin,
        } = res.data;
        dispatch(setUser({
          id, name, email, role, identification_number, admin,
        } as Professor | Student));
        setTimeout(() => push('/dashboard'), 2000);
      } else {
        const res = await axios.post(`${URL_BACKEND}/api/${userRole}/`, values);
        if (res && res.status === 201) success();
        const {
          id, name, email, role, identification_number, admin,
        } = res.data;
        dispatch(setUser({
          id, name, email, role, identification_number, admin,
        } as Professor | Student));
        setTimeout(() => push('/dashboard'), 2000);
      }
    } catch (error) {
      const parsedError = parseError(error);
      message.error(parsedError);
    }
    form.resetFields();
  };

  useEffect(() => {
    if (user && query.role) {
      const rol = roles[Number(query.role)];
      setUserRole(rol);
      axios.get(`${URL_BACKEND}/api/${rol}/by_email/${user.email}/`)
        .then((res) => {
          if (!isEmpty(res.data)) {
            setDataCheckedAlready(true);
            setUserData(first(res.data));
          }
          return null;
        })
        .catch(() => message.info('You have not verified your information yet'));
    }
  }, [user, query]);

  useEffect(() => {
    form.setFieldsValue({
      email: user?.email,
      name: user?.name,
      role: query.role,
    });
  }, [user, query]);

  return (
    <>
      <br />
      <br />
      <br />
      {contextHolder}
      <Container fixed maxWidth="sm" sx={{ border: '1px solid #ccc', borderRadius: '25px' }}>
        {dataCheckedAlready && (
          <Typography variant="h4" textAlign="center">
            Your information has been already confirmed. Would you like to do it again?
            <br />
            <Button type="dashed" onClick={() => setDataCheckedAlready(false)}>Yes</Button>
            {' '}
            <Button type="dashed" href="/dashboard">No</Button>
          </Typography>

        )}
        {!dataCheckedAlready && (
        <Form
          form={form}
          // validateMessages={validateMessages}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onFinish={handleSubmit}
          size="large"
        >
          <Typography variant="h4" textAlign="center">
            Professor
            {' '}
            {user?.name}
          </Typography>
          <Typography textAlign="center">
            Please verify that your information is correct
          </Typography>
          <Divider />
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Identification Number"
            name="identification_number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Rol" name="role" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="email" name="email" rules={[{ type: 'email', required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit">
              Verifiy
            </Button>
          </Form.Item>
        </Form>
        )}
      </Container>
    </>
  );
};

export default VerifyInfo;
