/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Professor } from '../types';

const initialState: Professor[] = [];

export const professorsSlice = createSlice({
  name: 'professors',
  initialState,
  reducers: {
    setProfessors: (state, action: PayloadAction<Professor[]>) => action.payload,
    clearProfessors: () => initialState,
  },
});

export const { setProfessors, clearProfessors } = professorsSlice.actions;
export default professorsSlice.reducer;
