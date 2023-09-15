/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
import {
  Badge,
  Calendar,
  message,
} from 'antd';
import { NextPage } from 'next';
import dayjs from 'dayjs';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  get,
  isEmpty,
  map,
} from 'lodash';

import type { Dayjs } from 'dayjs';
import axios from 'axios';
import type {
  Course,
  Professor,
  Schedule,
  Student,
  ValidStatus,
  calendarEvent,
} from '../../../types';

import { selectCourses, selectProfessors, selectStudents } from '../../../selectors/mainSelectors';
import { URL_BACKEND } from '../../../constants';
import ModalSchedule from '../../../components/modalSchedule';

const ScheduleClass: NextPage = () => {
  const hourFormat = 'HH:mm';
  const today = Date.now();

  const [date, setDate] = useState(() => dayjs(today));
  // console.log('🚀 ~ date:', date.format('YYYY-MM-DD'));
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<calendarEvent>(null);
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

  const onSelect = (newValue: Dayjs) => {
    setDate(newValue);
    setOpenModal(true);
  };

  const findCourse = (id: number) => {
    const foundedCourse = courseList.find((course) => course.id === id);
    if (foundedCourse) {
      const courseName = get(foundedCourse, 'course_name');
      return courseName?.toUpperCase();
    }
    return '';
  };

  const dynamicCalendarData = map(
    schedulesData,
    (schedule: Schedule) => ({
      date: schedule.date,
      events: [
        {
          content: findCourse(schedule.course),
          type: 'default',
        },
      ],
    }),
  );

  useEffect(() => {
    // setting singleSchedule
    // find schedulesData the one with the same date and course

    const event = selectedEvent?.content;
    if (event) {
      const foundSchedule = schedulesData
        .find(
          (schedule: Schedule) => dayjs(schedule.date).isSame(date, 'day')
          && findCourse(schedule.course).toLowerCase().includes(event?.toLowerCase()),
        );

      setSingleSchedule(foundSchedule || {} as Schedule);
    }
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
                      status={item.type ? item.type as ValidStatus : 'default'} // Usa 'default' si 'type' no está presente
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
      <ModalSchedule
        handleOpen={openModal}
        handleCancel={() => {
          setOpenModal(false);
          setSelectedEvent(null);
        }}
        refresh={fetchSchedules}
        studentsList={studentsList}
        courseList={courseList}
        professorsList={professorsList}
        hourFormat={hourFormat}
        date={date}
        schedule={singleSchedule}
        selectedEvent={selectedEvent}
      />
    </>
  );
};

export default ScheduleClass;
