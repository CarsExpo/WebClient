import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './assets/pages/home.jsx';
import Login from './assets/pages/login.jsx';
import Inscription from './assets/pages/inscription.jsx';
import Otp from './assets/pages/otp.jsx';
import Sidebar from './assets/pages/components/sidebar.jsx';
import Page404 from './assets/pages/404';
import ForgetPassword from './assets/pages/forgetPassword.jsx';
import ResetPassword from './assets/pages/resetPassword.jsx';
import EditAccount from './assets/pages/account.jsx';
import ConfirmEdit from './assets/pages/confirm-edit.jsx';
import AdminUser from './assets/pages/adminUser.jsx';
import { API_BASE_URL } from './config.js';

function PrivateRoute({ element, adminOnly }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null);

    const checkAdminStatus = async () => {
      if (token) {
        try {
          const response = await axios.get(API_BASE_URL + '/api/user/roles', {
            headers: { 'x-auth-token': token }
          });
          const data = response.data;
          if (data && data.role === 'admin') {
            setIsAdmin(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
      setIsLoading(false); 
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return null; 
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
}



function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/otp-verify" element={<Otp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/confirm-edit/:token" element={<ConfirmEdit />} />
        <Route path="/account" element={<EditAccount />} />
        <Route path="/admin/list-user" element={<PrivateRoute element={<AdminUser />} adminOnly={true} />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
