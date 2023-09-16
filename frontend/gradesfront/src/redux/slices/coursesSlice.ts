/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Course } from '../../types';

const initialState: Course[] = [];

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => action.payload,
    clearCourses: () => initialState,
  },
});

export const { setCourses, clearCourses } = coursesSlice.actions;
export default coursesSlice.reducer;
