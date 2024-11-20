import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserSession } from '../../utils/session';

const PrivateRoute = ({ children }) => {
  const session = getUserSession();
  return session ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
