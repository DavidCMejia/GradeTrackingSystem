/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Professor, Student } from '../../types';

type UserState = Professor | Student;

const initialState: UserState = {
  id: 0,
  identification_number: '',
  name: '',
  email: '',
  role: '',
  admin: false,
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
      state.admin = action.payload.admin;
      state.courses_enrolled = action.payload.courses_enrolled;
    },
    clearUser: (state) => {
      state.id = 0;
      state.identification_number = '';
      state.name = '';
      state.email = '';
      state.role = '';
      state.admin = false;
      state.courses_enrolled = [];
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
