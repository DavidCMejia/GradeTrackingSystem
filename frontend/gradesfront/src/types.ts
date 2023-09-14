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
    courses_enrolled: string[],
}

export type Student = MainInfo & {
    student_number?: string,
    courses_enrolled: number[],
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
    uuid?: string,
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
