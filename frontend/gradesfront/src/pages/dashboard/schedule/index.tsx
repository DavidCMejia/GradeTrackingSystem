/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */

import {
  Badge,
  Button,
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
} from 'lodash';

import type { Dayjs } from 'dayjs';
import axios from 'axios';
import type {
  CalendarEvent,
  Course,
  Professor,
  Schedule,
  Student,
  ValidStatus,
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>({} as CalendarEvent);
  console.log('🚀 ~ selectedEvent:', selectedEvent);
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

  const dynamicCalendarData = schedulesData.reduce((accumulator: CalendarEvent[], schedule) => {
    const day = schedule.date;
    const existingEntry = accumulator.find((entry) => entry.date === day);

    if (existingEntry) {
      // Agrega el evento al grupo existente
      existingEntry.events.push({
        content: findCourse(schedule.course),
        type: 'default',
      });
    } else {
      // Crea un nuevo grupo
      accumulator.push({
        date: day,
        events: [{
          content: findCourse(schedule.course),
          type: 'default',
        }],
      });
    }

    return accumulator;
  }, []);

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
                  <>
                    <Button
                      key={Number(index)}
                      onClick={() => setSelectedEvent({
                        date: eventData.date,
                        content: item.content,
                      } as CalendarEvent)}
                    >
                      <Badge
                        status={item.type ? item.type as ValidStatus : 'default'} // Usa 'default' si 'type' no está presente
                        text={item.content}
                      />
                    </Button>
                    <br />

                  </>
                ))}
              </ul>
            ) : null;
          }
          return info.originNode;
        }}
      />
      {selectedEvent && (
      <ModalSchedule
        handleOpen={openModal}
        handleCancel={() => {
          setOpenModal(false);
          setSelectedEvent({} as CalendarEvent);
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
      )}
    </>
  );
};

export default ScheduleClass;
