// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const parseError = (error) => {
  let errorMessage = 'There was an error.';

  if (error.response && error.response.data) {
    const errorData = error.response.data;
    if (errorData) {
      Object.keys(errorData).forEach((key) => {
        const errorMessages = errorData[key];
        errorMessage += ` ${key}: ${errorMessages}`;
      });
    }
  }

  return errorMessage;
};

export const filterCourses = (input: string, option: any) => {
  const { label } = option;
  return label.toLowerCase().includes(input.toLowerCase());
};

export const filterStudents = (input: string, option: any) => {
  const { label } = option;
  return label.toLowerCase().includes(input.toLowerCase());
};

export const filterProfessors = (input: string, option: any) => {
  const { label } = option;
  return label.toLowerCase().includes(input.toLowerCase());
};
