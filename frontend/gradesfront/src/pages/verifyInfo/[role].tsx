import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Container, Typography,
} from '@mui/material';
import {
  Form, Input, Button, message, Divider,
} from 'antd';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import axios from 'axios';
import { URL_BACKEND } from '../../constants';

const VerifyInfo: NextPage = () => {
  const { query } = useRouter();
  const { user } = useUser();
  console.log('🚀 ~ Role que llega  :', query.role);

  const [form] = Form.useForm();
  const handleSubmit = async (values: any) => {
    try {
      const res = await axios.get('http://localhost:8000/grades/api/professors/');
      console.log('🚀 ~ res:', res);
      if (res && res.status === 200) message.success('Registro creado con exito');
    } catch (error) {
      console.log(error);
      // message.error({
      //   content: `Error al guardar el registro: ${error}`,
      //   duration: 5,
      // });
    }

    // form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      email: user?.email,
      professorName: user?.name,
      role: query.role,
    });
  }, [user, query]);

  return (

    <>
      <br />
      <br />
      <br />
      <Container fixed maxWidth="sm" sx={{ border: '1px solid #ccc', borderRadius: '25px' }}>
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
            name="professorName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Identification Number"
            name="identificationNumber"
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
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Container>

    </>

  // <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} />

  );
};

export default VerifyInfo;
