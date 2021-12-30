import { getCookie } from 'cookies-next';
const getToken = () => {
  const token = getCookie('token')
  return token || '';
};

export default getToken;
