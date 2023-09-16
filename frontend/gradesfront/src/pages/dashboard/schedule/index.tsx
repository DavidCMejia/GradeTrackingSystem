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

import { selectCourses, selectProfessors, selectStudents } from '../../../redux/selectors/mainSelectors';
import { URL_BACKEND, formatHour } from '../../../constants';
import ModalSchedule from '../../../components/modalSchedule';

const ScheduleClass: NextPage = () => {
  const today = Date.now();

  const [date, setDate] = useState(() => dayjs(today));
  // console.log('🚀 ~ date:', date.format('YYYY-MM-DD'));
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>({} as CalendarEvent);
  const [schedulesData, setScheduleData] = useState<Schedule[]>([]);
  const [foundSchedules, setFoundSchedules] = useState<Schedule[]>([]);

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

  const dynamicCalendarData = schedulesData.reduce((
    accumulator: CalendarEvent[],
    schedule,
  ) => {
    const day = schedule.date;
    const existingEntry = accumulator.find((entry) => entry.date === day);

    if (existingEntry) {
      // Adds a new event to an existing group
      existingEntry.events.push({
        content: findCourse(schedule.course),
        type: 'default',
        ...schedule,
      });
    } else {
      // Creates a new group
      accumulator.push({
        date: day,
        events: [{
          content: findCourse(schedule.course),
          type: 'default',
          ...schedule,
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
        .filter(
          (schedule: Schedule) => dayjs(schedule.date).isSame(date, 'day')
          && findCourse(schedule.course).toLowerCase().includes(event?.toLowerCase()),
        );

      setFoundSchedules(foundSchedule || {} as Schedule[]);
    }
  }, [schedulesData, date, selectedEvent]);

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
              <div>
                {eventData.events.map((item, index) => (
                  <>
                    <Button
                      key={Number(index)}
                      onClick={() => setSelectedEvent({
                        ...eventData,
                        date: eventData.date,
                        content: item.content,
                      } as CalendarEvent)}
                    >
                      <Badge
                        status={item.type ? item.type as ValidStatus : 'default'}
                        text={item.content}
                      />
                    </Button>
                    <br />
                  </>
                ))}
              </div>
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
        hourFormat={formatHour}
        date={date}
        schedules={foundSchedules}
        selectedEvent={selectedEvent}
      />
      )}
    </>
  );
};

export default ScheduleClass;
