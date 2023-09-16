import { RootState } from '../../store';

export const selectUser = (state: RootState) => state.user;

export const selectStudents = (state: RootState) => state.students;

export const selectProfessors = (state: RootState) => state.professors;

export const selectCourses = (state: RootState) => state.courses;
