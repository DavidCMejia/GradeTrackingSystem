import { map, startCase } from 'lodash';

export const URL_BACKEND = 'http://localhost:8000/grades';
export const roles: { [key: number]: string } = {
  1: 'professors',
  2: 'students',
};

export const roleOptionsSelect = map(roles, (label, value) => ({
  value,
  label: startCase(label),
}));

export const emptyUserInfo = {
  id: '',
  identification_number: '',
  name: '',
  email: '',
  role: '',
  courses_enrolled: [],
};
