/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
import {
  Alert,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { isEmpty, map, omit } from 'lodash';
import axios from 'axios';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type {
  Course, Professor, Schedule, Student,
} from '../types';
import { URL_BACKEND } from '../constants';
import { filterCourses, filterProfessors, filterStudents } from '../utils';

type scheduleModalProps = {
    handleCancel: () => void,
    refresh: () => void,
    handleOpen: boolean,
    schedule: Schedule,
    professorsList:Professor[],
    studentsList: Student[],
    courseList: Course[],
    date: Dayjs,
    hourFormat: string,
    selectedEvent: any,
}

const { Item } = Form;
const ModalSchedule: FC<scheduleModalProps> = ({
  handleOpen,
  handleCancel,
  professorsList,
  studentsList,
  courseList,
  schedule,
  date,
  refresh,
  hourFormat,
  selectedEvent,
}) => {
  // console.log('🚀 ~ date:', date.format('YYYY-MM-DD'));
  const [modalForm] = Form.useForm();
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [errorResponse, setErrorResponse] = useState <string>('');
  const [httpMethod, setHttpMethod] = useState('');
  const [duration, setDuration] = useState(0);

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
      if (res && res.status === 201) {
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
    if (schedule) {
      const {
        students, professor, link, description,
      } = schedule;
      const event = selectedEvent?.content;
      const findCourseByName = courseList
        .find(
          (course: Course) => course.course_name
            .toLowerCase()
            .includes(event?.toLowerCase()),
        );

      const startTime = dayjs(schedule.starts, hourFormat);
      const endTime = dayjs(schedule.ends, hourFormat);

      modalForm.setFieldsValue({
        date,
        course: findCourseByName?.id,
        students,
        professor,
        link,
        description,
        time: ([startTime, endTime]),
      });

      if (!isEmpty(findCourseByName)) { setHttpMethod('PUT'); } else { setHttpMethod('POST'); }
    }
  }, [schedule]);

  useEffect(() => {
    if (!handleOpen) setHttpMethod('');
  }, [handleOpen]);

  return (
    <>
      {professorsList && studentsList && courseList && hourFormat && (
      <Modal
        title="Schedule Class"
        open={handleOpen}
        onCancel={handleCancel}
        onOk={modalForm.submit}
        okText="Schedule"
      >
        {!showSucessResponse && (
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
              options={map(courseList, (c:Course) => ({
                value: c.id,
                label: c.course_name.toUpperCase(),
              }))}
            />
          </Item>
          <Item label="Date" name="date">
            <DatePicker
              value={date}
              style={{ width: '100%' }}
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
        )}
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
      )}
    </>

  );
};

export default ModalSchedule;
