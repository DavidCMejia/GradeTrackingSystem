/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import {
  first, isEmpty, map, omit,
} from 'lodash';

import dayjs from 'dayjs';
import axios from 'axios';

import type { Dayjs } from 'dayjs';
import type {
  CalendarEvent,
  Course,
  Professor,
  Schedule,
  Student,
} from '../types';

import { filterCourses, filterProfessors, filterStudents } from '../utils';
import { URL_BACKEND, formatDate, formatHour } from '../constants';

type scheduleModalProps = {
    handleCancel: () => void,
    refresh: () => void,
    handleOpen: boolean,
    schedules: Schedule[],
    professorsList:Professor[],
    studentsList: Student[],
    courseList: Course[],
    date: Dayjs,
    hourFormat: string,
    selectedEvent: CalendarEvent,
}

const { Item } = Form;
const ModalSchedule: FC<scheduleModalProps> = ({
  handleCancel,
  refresh,
  handleOpen,
  schedules,
  professorsList,
  studentsList,
  courseList,
  date,
  hourFormat,
  selectedEvent,
}) => {
  // console.log('🚀 ~ date:', date.format('YYYY-MM-DD'));
  const [modalForm] = Form.useForm();
  const [showSucessResponse, setShowSucessResponse] = useState <boolean>(false);
  const [showFailureResponse, setShowFailureResponse] = useState <boolean>(false);
  const [errorResponse, setErrorResponse] = useState <string>('');
  const [httpMethod, setHttpMethod] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [singleSchedule, setSingleSchedule] = useState<Schedule>();
  const [multipleSchedules, setMultipleSchudules] = useState<boolean>(false);

  const onFinish = async (values: Schedule) => {
    const hourTime = values.time.map((t) => dayjs(t));
    const formattedTime = hourTime.map((timeValue) => timeValue.format(hourFormat));

    const valuesToSubmit = {
      ...omit(values, 'time'),
      starts: formattedTime[0],
      ends: formattedTime[1],
      date: date.format(formatDate),
      duration,
    };
    // console.log('🚀 ~ valuesToSubmit:', valuesToSubmit);
    try {
      const res = httpMethod === 'PUT'
        ? !isEmpty(singleSchedule)
        && await axios.put(`${URL_BACKEND}/api/schedules/${singleSchedule.id}/`, valuesToSubmit)
        : await axios.post(`${URL_BACKEND}/api/schedules/`, valuesToSubmit);

      if (res && (res.status === 201 || res.status === 200)) {
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
    const event = selectedEvent?.content;
    if (!isEmpty(singleSchedule) && event) {
      const {
        students, professor, link, description,
      } = singleSchedule;
      const findCourseByName = courseList
        .find(
          (course: Course) => course.course_name
            .toLowerCase()
            .includes(event?.toLowerCase()),
        );

      const formmatedStart = dayjs(singleSchedule.starts, hourFormat);
      const formmatedEnd = dayjs(singleSchedule.ends, hourFormat);

      modalForm.setFieldsValue({
        date,
        course: findCourseByName?.id,
        students,
        professor,
        link,
        description,
        time: ([formmatedStart, formmatedEnd]),
      });

      modalForm.setFieldsValue({ date });
      if (!isEmpty(findCourseByName)) { setHttpMethod('PUT'); } else { setHttpMethod('POST'); }
    }
  }, [singleSchedule, selectedEvent, date]);

  useEffect(() => {
    if (!handleOpen) setHttpMethod(''); modalForm.resetFields();
  }, [handleOpen]);

  useEffect(() => {
    if (schedules && schedules.length > 1) {
      setMultipleSchudules(true);
    } else {
      setMultipleSchudules(false);
      setSingleSchedule(first(schedules));
    }
  }, [schedules]);

  return (
    <>
      {professorsList && studentsList && courseList && hourFormat && (
      <Modal
        title={multipleSchedules ? 'Multiple Schedules' : 'Schedule Class'}
        open={handleOpen}
        onCancel={handleCancel}
        onOk={() => {
          modalForm.validateFields()
            .then(() => modalForm.submit())
            .catch();
        }}
        okText="Schedule"
        footer={multipleSchedules ? null : undefined}
      >
        {!showSucessResponse && !multipleSchedules && (
        <>
          <Form
            form={modalForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            onFinish={onFinish}
          >
            <Item label="Course" name="course" rules={[{ required: true }]}>
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
                defaultValue={date}
                value={date}
                style={{ width: '100%' }}
                onChange={(newValue) => { if (newValue) date = newValue; }}
              />
            </Item>
            <Item label="Time" name="time" rules={[{ required: true }]}>
              <TimePicker.RangePicker
                format={hourFormat}
                style={{ width: '100%' }}
                onOk={(value) => {
                  if (value && value[1] && value[0]) {
                    setDuration(value[1].diff(value[0], 'minute'));
                  }
                }}
              />
            </Item>
            <Item label="Students" name="students" rules={[{ required: true }]}>
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
            <Item label="Professor" name="professor" rules={[{ required: true }]}>
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
          {!multipleSchedules && schedules.length > 1 && (
          <Button
            onClick={() => {
              setMultipleSchudules(true);
            }}
          >
            Select another time
          </Button>
          )}
        </>
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

        {(multipleSchedules && !showSucessResponse) && (
          <>
            <p>
              The course
              {' '}
              {selectedEvent.content}
              {' '}
              is happening in
              {' '}
              {schedules.length}
              {' '}
              different hours
            </p>
            <p>Which of the following would you like to see?</p>
            <Select
              showSearch
              placeholder="Select schedule"
              optionFilterProp="children"
              filterOption={filterCourses}
              options={map(schedules, (schedule:Schedule) => ({
                value: schedule.id,
                label: dayjs(schedule.starts, 'HH:mm:ss').format(formatHour),
              }))}
              onChange={(value) => {
                const foundSchedule = schedules.find((schedule) => schedule.id === value);
                if (foundSchedule) {
                  setSingleSchedule(foundSchedule);
                  setMultipleSchudules(false);
                }
              }}
            />
          </>
        )}
      </Modal>
      )}
    </>

  );
};

export default ModalSchedule;
