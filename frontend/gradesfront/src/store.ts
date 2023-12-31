import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './redux/slices/userSlice';
import studentsReducer from './redux/slices/studentsSlice';
import professorsReducer from './redux/slices/professorsSlice';
import coursesReducer from './redux/slices/coursesSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  students: studentsReducer,
  professors: professorsReducer,
  courses: coursesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
