/* eslint-disable camelcase */
export type MainInfo = {
    id?: string,
    identification_number: string,
    name: string,
    role?: string,
    email: string
}
export type Professor = MainInfo & {
    professor_number?: string,
    courses_enrolled?: string[],
}

export type Student = MainInfo & {
    student_number?: string,
    courses_enrolled?: string[],
}

export type Course = {
    id: string,
    course_name: string,
    course_code: string,
    professor: number,
    students: number[],
}
