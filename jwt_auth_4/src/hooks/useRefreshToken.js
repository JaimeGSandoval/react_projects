import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true, // Important: This allows us to send cookies with our request. This request is going to send along our cookie that has response token. It's a secure cookie that we  never see inside of our javascript code, but axios can send it to the backend endpoint that wee need it to.
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken); // accessToken is the new generated accessToken from the backend.
      return { ...prev, accessToken: response.data.accessToken }; // Overwrite the accessToken with a new accessToken.
    });
    return response.data.accessToken; // Return this new accessToken so we can use it with our request because we will call this function when our initial request fails when our accessToken has expired. Then it will refresh, get a new token, and we will retry the request.
  };

  return refresh;
};

export default useRefreshToken;
