/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Student } from '../types';

const initialState: Student[] = [];

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => action.payload,
    clearStudents: () => initialState,
  },
});

export const { setStudents, clearStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
