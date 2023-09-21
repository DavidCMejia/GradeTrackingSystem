import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import {
  Form, Input, Modal, Alert, message,
} from 'antd';
import axios from 'axios';
import Add from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import { selectUser } from '../../../redux/selectors/mainSelectors';
import { setUser } from '../../../redux/slices/userSlice';
import type { AdminLogin } from '../../../types';
import { PROFESSOR_ROLE, URL_BACKEND } from '../../../constants';

const { Item } = Form;
const Admin: NextPage = () => {
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [studentsData, setStudentsData] = useState<any[]>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { push, asPath } = useRouter();
  const userRedux = useSelector(selectUser);

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Student deleted successfully',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };


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

  const fetchStudents = () => {
    axios.get(`${URL_BACKEND}/api/students/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setStudentsData(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const handleEditClick = (row) => {
    setOpenEditModal(true);
    setSelectedStudent(row);
  };

  const handleDeleteClick = (row) => {
    axios.delete(`${URL_BACKEND}/api/students/${row.id}/`)
      .then((res) => {
        if (res && res.status === 204) {
          success();
          fetchStudents();
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
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

  useEffect(() => {
    if (userRedux.role !== PROFESSOR_ROLE) {
      message.error('You are not allowed to access this page, please contact the administrator.');
      push('/dashboard');
    }
  }, [userRedux]);

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

  const rowTitleStyle: CSSProperties = {
    textAlign: 'center',
    fontWeight: 'bold',
  };
  const centerRowStyle: CSSProperties = {
    textAlign: 'center',
  };

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
      <br />
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Users
        <br />
        <Button variant="outlined" color="success" onClick={() => push(`${asPath}/create`)}><Add /></Button>
        <br />
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            marginBottom: '20px', marginTop: '20px', maxWidth: '100px', minWidth: '850px',
          }}
        />
      </Typography>
      {contextHolder}
      <TableContainer
        component={Paper}
        style={{
          border: '1px solid #ccc', margin: 'auto', maxWidth: '100px', minWidth: '850px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell style={rowTitleStyle}>id</TableCell> */}
              {/* <TableCell style={rowTitleStyle}>#</TableCell> */}
              <TableCell style={rowTitleStyle}>Identification</TableCell>
              <TableCell style={rowTitleStyle}>Name</TableCell>
              <TableCell style={rowTitleStyle}>Email</TableCell>
              <TableCell style={rowTitleStyle}>Courses</TableCell>
              <TableCell style={rowTitleStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && map(filteredData, (student) => {
              const foundRole = roles[Number(student.role)];

              return (
                <TableRow key={student.id}>
                  {/* <TableCell style={centerRowStyle}>{student.id}</TableCell> */}
                  {/* <TableCell style={centerRowStyle}>{student.student_number}</TableCell> */}
                  <TableCell style={centerRowStyle}>{student.identification_number}</TableCell>
                  <TableCell style={centerRowStyle}>{student.name}</TableCell>
                  <TableCell style={centerRowStyle}>{student.email}</TableCell>
                  <TableCell style={centerRowStyle}>
                    <Button variant="outlined" onClick={() => handleEditClick(student)}><EditIcon /></Button>
                    <Button color="error" style={{ marginLeft: '8px' }} variant="outlined" onClick={() => handleDeleteClick(student)}><DeleteIcon /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Admin;
