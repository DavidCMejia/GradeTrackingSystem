/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
import {
  Alert,
  Badge,
  BadgeProps,
  Button,
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

import { get, isEmpty, map } from 'lodash';

import type { Dayjs } from 'dayjs';
import type {
  Course,
  Professor,
  Schedule,
  Student,
} from '../../../types';

import { selectCourses, selectProfessors, selectStudents } from '../../../selectors/mainSelectors';
import { filterCourses, filterProfessors, filterStudents } from '../../../utils';

const { Item } = Form;
const ScheduleClass: NextPage = () => {
  const today = Date.now();
  const hourFormat = 'HH:mm';

  const [modalForm] = Form.useForm();

  const [date, setDate] = useState(() => dayjs(today));
  // console.log('🚀 ~ date:', date.format('YYYY-MM-DD'));
  const [openModal, setOpenModal] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [httpMethod, setHttpMethod] = useState('');
  // console.log('🚀 ~ setDuration:', duration); // en MINUTOS

  const courseList: Course[] = useSelector(selectCourses);
  const studentsList: Student[] = useSelector(selectStudents);
  const professorsList: Professor[] = useSelector(selectProfessors);

  const onFinish = (values: Schedule) => {
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

  useEffect(() => {
    if (openModal) {
      const event = selectedEvent?.content;
      const findCourseByName = courseList
        .find(
          (course: Course) => course.course_name
            .toLowerCase()
            .includes(event?.toLowerCase()),
        );

      modalForm.setFieldsValue({
        date,
        course: findCourseByName?.id,
        // students,
      });

      if (!isEmpty(findCourseByName)) { setHttpMethod('PUT'); } else { setHttpMethod('POST'); }
    }
  }, [openModal]);

  const idCurso = 7;

  const findCourse = (id: number) => {
    const foundedCourse = courseList.find((course) => course.id === id);
    const courseName = get(foundedCourse, 'course_name');
    return courseName?.toUpperCase();
  };

  const calendarData = [
    {
      date: '2023-09-08', // Fecha en formato 'YYYY-MM-DD'
      events: [
        { content: findCourse(idCurso) },
      ],
    },
    {
      date: '2023-09-15',
      events: [
        { content: findCourse(idCurso) },
        { content: findCourse(idCurso) },
        { content: findCourse(idCurso) },
      ],
    },
  ];

  return (
    <>
      <Calendar
        mode="month"
        value={date}
        onSelect={onSelect}
        cellRender={(current, info) => {
          if (info.type === 'date') {
            const eventData = calendarData.find((item) => item.date === current.format('YYYY-MM-DD'));
            return eventData ? (
              <ul className="events" style={{ listStyleType: 'none' }}>
                {eventData.events.map((item, index) => (
                  <li
                    style={{ listStyle: 'none' }}
                    key={index}
                    onClick={() => setSelectedEvent(item)}
                  >
                    <Badge
                      status={item.type ? item.type : 'default'} // Usa 'default' si 'type' no está presente
                      text={item.content}
                    />
                  </li>
                ))}
              </ul>
            ) : null;
          }
          return info.originNode;
        }}
      />
      <Modal
        title="Schedule Class"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setSelectedEvent(null);
          setHttpMethod('');
        }}
        onOk={modalForm.submit}
        okText="Schedule"
      >
        <Form
          form={modalForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
        >
          <Item label="Course" name="course">
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
          <Item label="Date" name="date">
            <DatePicker
              value={date}
              style={{ width: '100%' }}
              onChange={(value) => { if (value) setDate(value); }}
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
          <Item label="Students" name="students">
            <Select
              showSearch
              mode="multiple"
              placeholder="Select students"
              optionFilterProp="children"
              filterOption={filterStudents}
              options={map(studentsList, (student:Student) => ({
                value: student.id,
                label: student.name,
              }))}
            />
          </Item>
          <Item label="Professor" name="professor">
            <Select
              showSearch
              placeholder="Select a professor"
              optionFilterProp="children"
              filterOption={filterProfessors}
              options={map(professorsList, (professor:Professor) => ({
                value: professor.id,
                label: professor.name,
              }))}
            />
          </Item>
          <Item label="Link" name="link">
            <Input />
          </Item>
          <Item label="Description" name="description">
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
