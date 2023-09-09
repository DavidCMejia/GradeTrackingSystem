/* eslint-disable camelcase */
export type MainInfo = {
    id?: string,
    identification_number: string,
    name: string,
    role?: string,
    email: string
}
export type Professor = MainInfo & {
    professor_number?: number,
}

export type Student = MainInfo & {
    student_number?: number,
    courses_enrolled?: string[],
}
