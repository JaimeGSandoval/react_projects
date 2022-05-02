import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

// We create this axios hook so we can use a private version of axios and use tokens with it anytime we use this instance of axios.
// This isn't a hook that abstracts everything. This hook will just be to attach the interceptors to the axios private instance.

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // if config.headers['Authorization'] does not exist, then we know it's not a retry. This will be the first attempt.Otherwise if it is set we know it's a retry and it's already been set with the responseInterceptor after a 403/failed request.
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // HTTP code will be 403 forbidden if  our request has failed due to an expired access token.
        // Checks if the custom property .sent does not exist. We do not want to get stuck in this endless loop that could happen with 403, so we only want to retry once and the sent property indicates that.
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest); // Now that we have a new access token, we call axiosPrivate again because we updated the access token by using the refresh token and now we're making a request again.
        }

        return Promise.reject(error);
      }
    );

    // Interceptors do not remove themselves. We use the clean up function to remove them.
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate; // This will have the interceptors added to handle the jwt tokens that we need to request the data and possibly retry and get a new access token if necessary.
};

export default useAxiosPrivate;
