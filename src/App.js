import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './assets/pages/home.jsx';
import Login from './assets/pages/login.jsx';
import Inscription from './assets/pages/inscription.jsx';
import Otp from './assets/pages/otp.jsx';
import Navbar from './assets/pages/components/navbar.jsx'
import Page404 from './assets/pages/404';
import ForgetPassword from './assets/pages/forgetPassword.jsx';
import ResetPassword from './assets/pages/resetPassword.jsx';
import EditAccount from './assets/pages/account.jsx';
import ConfirmEdit from './assets/pages/confirm-edit.jsx';

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/otp-verify" element={<Otp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/edit-account" element={<EditAccount />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/confirm-edit/:token" element={<ConfirmEdit/>}/>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;