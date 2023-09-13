import { RootState } from '../store';

export const selectCounter = (state: RootState) => state.counter.value;

export const selectUser = (state: RootState) => state.user;

export const selectStudents = (state: RootState) => state.students;
