/* eslint-disable camelcase */
export type MainInfo = {
    id?: number,
    identification_number: string,
    name: string,
    role: string,
    email: string
}
export type Professor = MainInfo & {
    professor_number?: string,
    courses_enrolled?: string[],
    admin: boolean,
}

export type Student = MainInfo & {
    student_number?: string,
    courses_enrolled: number[],
    admin?: boolean,
}

export type Grade = {
    id?: number,
    uuid: string,
    student: number,
    course: number,
    grade: number,
}

export type Course = {
    id: number,
    uuid?: string,
    course_name: string,
    course_code: string,
    professor: number,
    students: number[],
}

export type Schedule = {
    id?: number,
    uuid: string,
    course: number,
    date: Date,
    time: string[],
    starts: string
    ends: string,
    duration: number,
    students: number[],
    professor: number,
    link: string,
    description: string,
}

export type ValidStatus = 'default' | 'success' | 'processing' | 'error' | 'warning';

export type CalendarEvent = {
    date: Date;
    events: { content: string, type: string }[];
    content?: string;
    type?: string;
};

export type AdminLogin = {
    username: string,
    password: string,
};

export type User = {
    id: number,
    identification_number: string,
    name: string,
    email: string,
    status: boolean,
    professor_id: string,
    student_id: string,
};
