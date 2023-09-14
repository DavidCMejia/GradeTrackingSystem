import {
  Alert,
  Badge,
  BadgeProps,
  Calendar,
  CalendarProps,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from 'antd';
import { NextPage } from 'next';
import dayjs from 'dayjs';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { map } from 'lodash';

import type { Dayjs } from 'dayjs';
import type { Course } from '../../../types';

import { selectCourses } from '../../../selectors/mainSelectors';

const { Item } = Form;
const ScheduleClass: NextPage = () => {
  const today = Date.now();
  const hourFormat = 'HH:mm';

  const [modalForm] = Form.useForm();

  const [date, setDate] = useState(() => dayjs(today));
  // console.log('🚀 ~ date:', date.format('YYYY-MM-DD'));
  const [openModal, setOpenModal] = useState(false);
  const [duration, setDuration] = useState(0);
  const courseList: Course[] = useSelector(selectCourses);
  // console.log('🚀 ~ setDuration:', duration); // en MINUTOS

  const filterCourses = (input: string, option: any) => {
    const { label } = option;
    return label.toLowerCase().includes(input.toLowerCase());
  };

  const onFinish = (values) => {
    const valuesToSubmit = {
      ...values,
      date,
      duration,
    };
    console.log('🚀 ~ valuesToSubmit:', {
      ...valuesToSubmit,
      date: valuesToSubmit.date.format('YYYY-MM-DD'),
    });
    // try {
    //   const res = await axios.put(`${URL_BACKEND}/api/students/${values.id}/`, values);
    //   if (res && res.status === 200) {
    //     setShowSucessResponse(true);
    //     setTimeout(() => {
    //       setShowSucessResponse(false);
    //     }, 3000);
    //     refresh();
    //   }
    // } catch (error: any) {
    //   setErrorResponse(error.message);
    //   setShowFailureResponse(true);
    //   setTimeout(() => {
    //     setShowFailureResponse(false);
    //   }, 4000);
    // }
  };

  const onSelect = (newValue: Dayjs) => {
    setDate(newValue);
    setOpenModal(true);
  };

  const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event......' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  useEffect(() => {
    if (openModal) {
      modalForm.setFieldsValue({
        date,
      });
    }
  }, [openModal]);

  return (
    <>
      <Calendar
        value={date}
        onSelect={onSelect}
        cellRender={cellRender}
      />
      <Modal
        title="Schedule Class"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={modalForm.submit}
      >
        <Form
          form={modalForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
        >
          <Item label="Course" name="courses">
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
          <Item label="Date" name="date">
            <DatePicker
              value={date}
              style={{ width: '100%' }}
              onChange={(value) => setDate(value)}
            />
          </Item>
          <Item label="Time" name="time">
            <TimePicker.RangePicker
              format={hourFormat}
              style={{ width: '100%' }}
              onOk={(value) => {
                if (value && value[1]) setDuration(value[1].diff(value[0], 'minute'));
              }}
            />
          </Item>
          <Item label="Description" name="description">
            <Input />
          </Item>
          <Item label="Link" name="link">
            <Input />
          </Item>
        </Form>
        {/* <Alert
          message="Class Scheduled"
          description={`Class successfully scheduled for ${selectedValue?.format('YYYY-MM-DD')}`}
          type="success"
          showIcon
        />
        <br /> */}
      </Modal>
    </>
  );
};

export default ScheduleClass;
