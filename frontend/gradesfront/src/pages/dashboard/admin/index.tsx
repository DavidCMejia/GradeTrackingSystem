import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import {
  Form, Input, Modal, Alert,
} from 'antd';
import axios from 'axios';
import { selectUser } from '../../../redux/selectors/mainSelectors';
import { setUser } from '../../../redux/slices/userSlice';
import type { AdminLogin } from '../../../types';
import { URL_BACKEND } from '../../../constants';

const { Item } = Form;
const Admin: NextPage = () => {
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userRedux = useSelector(selectUser);

  const onSubmit = async (values: AdminLogin) => {
    if (values.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME
      && values.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      const res = await axios.patch(`${URL_BACKEND}/api/professors/${userRedux.id}/`, {
        admin: true,
      });
      if (res.status !== 200) {
        setShowFailureResponse(true);
        setTimeout(() => {
          setShowFailureResponse(false);
        }, 3000);
      }

      dispatch(setUser({ ...userRedux, admin: true }));
      setShowSucessResponse(true);
      setTimeout(() => {
        setShowSucessResponse(false);
        setOpenModal(false);
      }, 3000);
    } else {
      setShowFailureResponse(true);
      setTimeout(() => {
        setShowFailureResponse(false);
      }, 3000);
    }
  };

  const removePrivileges = async () => {
    const res = await axios.patch(`${URL_BACKEND}/api/professors/${userRedux.id}/`, {
      admin: false,
    });
    if (res.status !== 200) {
      throw new Error('Error removing privileges');
    }
    dispatch(setUser({ ...userRedux, admin: false }));
  };

  if (!userRedux.admin) {
    return (
      <>
        <Typography variant="h3" textAlign="center">Welcome to the Admin module!</Typography>
        <Typography textAlign="center">
          {userRedux.name}
          {' '}
          is not an admin, so you can not access this module.
          <br />
          However, you can type the admin password to get admin privileges.
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setOpenModal(true); }}
          >
            Access
          </Button>
        </Typography>
        <Modal
          title="Admin"
          open={openModal}
          onCancel={() => { setOpenModal(false); }}
          onOk={() => {
            form.validateFields()
              .then(() => form.submit())
              .catch();
          }}
        >
          {showSucessResponse && (
          <>
            <Alert
              message="Login Successful"
              description={`Admin privileges granted to ${userRedux.name.toUpperCase()}`}
              type="success"
              showIcon
            />
            <br />
          </>
          )}
          {showFailureResponse && (
          <>
            <Alert
              message="Login Failed"
              description="User or password incorrect"
              type="error"
              showIcon
            />
            <br />
          </>
          )}
          {!showSucessResponse && (
          <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            onFinish={(values) => onSubmit(values)}
          >
            <Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input a username' }]}
            >
              <Input />
            </Item>
            <Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input a password' }]}
            >
              <Input.Password />
            </Item>
          </Form>
          )}
        </Modal>
      </>
    );
  }

  return (
    <>
      <Typography variant="h3" textAlign="center">You have admin privileges</Typography>
      <Typography textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => { removePrivileges(); }}
        >
          Remove Privileges
        </Button>
      </Typography>

    </>
  );
};

export default Admin;