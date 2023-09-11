/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Professor, Student } from '../types';

type UserState = Professor | Student;

const initialState: UserState = {
  id: '',
  identification_number: '',
  name: '',
  email: '',
  role: '',
  courses_enrolled: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.identification_number = action.payload.identification_number;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.courses_enrolled = action.payload.courses_enrolled;
    },
    clearUser: (state) => {
      state.id = '';
      state.identification_number = '';
      state.name = '';
      state.email = '';
      state.role = '';
      state.courses_enrolled = [];
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
