import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // The main logic here is we're comparing the values of two arrays. We have a roles array inside of our global authentication that says all the roles that the current user has. and then we have the allowedRoles array that is passed in to this component
  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    // Outlet represents any child components aka nested components of RequireAuth
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    // We set replace because the user isn't asking to go to/login. They wanted to go to another page, but they weren't logged in, so we send them to the login page. So we replace the login in their navigation history with the location which they came from. This way they can navigate back to the previous page is they need to.
    <Navigate to="/login" state={{ from: location }} replace />
    // state attribute: The navigation state is the state where React Navigation stores the navigation structure and history of the app.
  );
};

export default RequireAuth;
