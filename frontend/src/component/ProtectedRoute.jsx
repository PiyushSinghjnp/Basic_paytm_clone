import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => { // element is the component to be rendered  rest can be omiited 
  const userToken = localStorage.getItem('token');

  if (userToken) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" />;
  }

  // Render the element if not authenticated
  return element;
};

export default ProtectedRoute;
