import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../component/common/Header';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { login } = useSelector((state) => state.sign);
  if (login) {
    return <Navigate to={'/'} />;
  }
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default AuthLayout;
