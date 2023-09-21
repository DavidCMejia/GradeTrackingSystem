/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
import {
  Alert,
  Form,
  Input,
  Modal,
  Select,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import type { Professor, User } from '../types';
import { URL_BACKEND } from '../constants';

  type EditUserModalProps = {
      handleOpen: boolean,
      handleCancel: () => void,
      user: User,
      professorList: Professor[],
      usersList: User[],
      refresh: () => void,
  }

const { Option } = Select;
const { Item } = Form;
const ModalEditUser: FC<EditUserModalProps> = ({
  handleOpen,
  handleCancel,
  professorList,
  usersList,
  user,
  refresh,
}) => {
  const [modalForm] = Form.useForm();
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [errorResponse, setErrorResponse] = useState <string>('');

  const onFinish = async () => {
    const values = modalForm.getFieldsValue();
    try {
      const res = await axios.put(`${URL_BACKEND}/api/users/${values.id}/`, values);

      if (res && res.status === 200) {
        const foundProfessor = professorList
          .find((professor) => professor.id === values.professor_id);
        if (foundProfessor) {
          await axios.patch(`${URL_BACKEND}/api/professors/${values.professor_id}/`, {
            name: values.name,
            email: values.email,
            identification_number: values.identification_number,
          });
        }
        setShowSucessResponse(true);
        setTimeout(() => {
          setShowSucessResponse(false);
        }, 3000);
        refresh();
      }
    } catch (error: any) {
      setErrorResponse(error.message);
      setShowFailureResponse(true);
      setTimeout(() => {
        setShowFailureResponse(false);
      }, 4000);
    }
  };

  useEffect(() => {
    if (user) {
      const {
        id, identification_number, name, email, status, professor_id, student_id,
      } = user;

      modalForm.setFieldsValue({
        id,
        identification_number,
        name,
        email,
        status,
        professor_id,
        student_id,
      });
    }
  }, [user]);

  return (
    <>
      {usersList && (
        <Modal
          title="Update User"
          open={handleOpen}
          onCancel={handleCancel}
          onOk={() => {
            modalForm.validateFields()
              .then(() => modalForm.submit())
              .catch();
          }}
        >
          {showSucessResponse && (
          <>
            <Alert
              message="User Updated"
              description={`${user.name.toUpperCase()} successfully updated`}
              type="success"
              showIcon
            />
            <br />
          </>
          )}
          {showFailureResponse && (
          <>
            <Alert
              message="User Not Updated"
              description={`There was an error updating ${user.name.toUpperCase()}, error: ${errorResponse}`}
              type="error"
              showIcon
            />
            <br />
          </>
          )}
          {!showSucessResponse && (
          <Form
            form={modalForm}
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
          </Form>
          )}
        </Modal>
      )}
    </>

  );
};

export default ModalEditUser;
