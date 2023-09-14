/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
import {
  Alert,
  Badge,
  Calendar,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
  message,
} from 'antd';
import { NextPage } from 'next';
import dayjs from 'dayjs';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  get, isEmpty, map, omit,
} from 'lodash';

import type { Dayjs } from 'dayjs';
import axios from 'axios';
import type {
  Course,
  Professor,
  Schedule,
  Student,
} from '../../../types';

import { selectCourses, selectProfessors, selectStudents } from '../../../selectors/mainSelectors';
import { filterCourses, filterProfessors, filterStudents } from '../../../utils';
import { URL_BACKEND } from '../../../constants';

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
  const [showSucessResponse, setShowSucessResponse] = useState(false);
  const [showFailureResponse, setShowFailureResponse] = useState(false);
  const [errorResponse, setErrorResponse] = useState('');
  const [schedulesData, setScheduleData] = useState<Schedule[]>([]);
  const [singleSchedule, setSingleSchedule] = useState<Schedule>({} as Schedule);

  const courseList: Course[] = useSelector(selectCourses);
  const studentsList: Student[] = useSelector(selectStudents);
  const professorsList: Professor[] = useSelector(selectProfessors);

  const fetchSchedules = async () => {
    axios.get(`${URL_BACKEND}/api/schedules/`)
      .then((res) => {
        if (!isEmpty(res.data)) {
          setScheduleData(res.data);
        }
        return null;
      })
      .catch((e) => message.error(e.toString()));
  };

  const onFinish = async (values: Schedule) => {
    const hourTime = values.time.map((t) => dayjs(t));
    const formattedTime = hourTime.map((timeValue) => timeValue.format(hourFormat));

    const valuesToSubmit = {
      ...omit(values, 'time'),
      starts: formattedTime[0],
      ends: formattedTime[1],
      date: date.format('YYYY-MM-DD'),
      duration,
    };
    // console.log('🚀 ~ valuesToSubmit:', valuesToSubmit);
    try {
      const res = await axios.post(`${URL_BACKEND}/api/schedules/`, valuesToSubmit);
      if (res && res.status === 200) {
        setShowSucessResponse(true);
        setTimeout(() => {
          setShowSucessResponse(false);
        }, 3000);
        fetchSchedules();
      }
    } catch (error: any) {
      setErrorResponse(error.message);
      setShowFailureResponse(true);
      setTimeout(() => {
        setShowFailureResponse(false);
      }, 4000);
    }
  };

  const onSelect = (newValue: Dayjs) => {
    setDate(newValue);
    setOpenModal(true);
  };

  useEffect(() => {
    if (openModal && singleSchedule) {
      const {
        students, professor, link, description,
      } = singleSchedule;
      const event = selectedEvent?.content;
      const findCourseByName = courseList
        .find(
          (course: Course) => course.course_name
            .toLowerCase()
            .includes(event?.toLowerCase()),
        );

      const startTime = dayjs(singleSchedule.starts, hourFormat);
      const endTime = dayjs(singleSchedule.ends, hourFormat);

      modalForm.setFieldsValue({
        date,
        course: findCourseByName?.id,
        students,
        professor,
        link,
        description,
        time: [startTime, endTime],
      });

      if (!isEmpty(findCourseByName)) { setHttpMethod('PUT'); } else { setHttpMethod('POST'); }
    }
  }, [openModal, singleSchedule]);

  const findCourse = (id: number) => {
    const foundedCourse = courseList.find((course) => course.id === id);
    const courseName = get(foundedCourse, 'course_name');
    return courseName?.toUpperCase();
  };

  const dynamicCalendarData = map(
    schedulesData,
    (schedule: Schedule) => ({
      date: schedule.date,
      events: [
        { content: findCourse(schedule.course) },
      ],
    }),
  );

  useEffect(() => {
    // setting singleSchedule
    // find schedulesData the one with the same date and course

    const event = selectedEvent?.content;
    const foundSchedule = schedulesData
      .find(
        (schedule: Schedule) => dayjs(schedule.date).isSame(date, 'day')
        && findCourse(schedule.course).toLowerCase().includes(event?.toLowerCase()),
      );

    setSingleSchedule(foundSchedule || {} as Schedule);
  }, [schedulesData, date]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <>
      <Calendar
        mode="month"
        value={date}
        onSelect={onSelect}
        cellRender={(current, info) => {
          if (info.type === 'date') {
            const eventData = dynamicCalendarData.find((item) => dayjs(item.date).isSame(current, 'day'));
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
        {showSucessResponse && (
        <Alert
          message="Class Scheduled"
          description={`Class successfully scheduled for ${date?.format('YYYY-MM-DD')}`}
          type="success"
          showIcon
        />
        )}
        {showFailureResponse && (
          <Alert
            message="Error"
            description={errorResponse}
            type="error"
            showIcon
          />
        )}
      </Modal>
    </>
  );
};

export default ScheduleClass;
