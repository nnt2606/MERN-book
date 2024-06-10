import axiosInstance from '../redux/axiosInstance';

export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);
  // const { accessToken } = response.data;
  // localStorage.setItem('accessToken', accessToken);
  // console.log(accessToken);
  return response;
};

export const signupUser = async (userData) => {
  const response = await axiosInstance.post('/auth/signup', userData);
  return response;
};

export const logoutUser = async () => {
  await axiosInstance.get('/api/logout');
  localStorage.removeItem('accessToken');
};

