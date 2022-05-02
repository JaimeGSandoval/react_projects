import { createContext, useState } from 'react';
// you should store your authentication in global state context
// authentication values such as user, pwd, roles, accessToken

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
