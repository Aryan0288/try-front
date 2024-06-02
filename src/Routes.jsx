import React, { useContext, useEffect, useState } from 'react'
// import Register from './RegisterAndLogin.jsx';
import { UserContext } from './UserContext.jsx';
import SignUp from './SignUp.jsx';
import Chat from './Chat.jsx';
import LoginPage from './LoginPage.jsx'
import { Route, Routes } from 'react-router-dom';
import OTPVerification from './Components/otpVerification.jsx';
import axios from 'axios';
import PasswordReset from './Components/Pages/PasswordReset.jsx'
import SignUp1 from './newPages/SignUpPages/SignUp1.jsx';
import Login1 from './newPages/SignUpPages/Login1.jsx';

export default function RoutesPath() {
  const [tokenPresent, setTokenPresent] = useState();


  const { username } = useContext(UserContext);
  

  if (username) {
    return (
      <Chat />
    )
  }


  return (



    <div>
      <div className='bg-[#000814]'>

      </div>
      <Routes>
        <Route path="/" element={<SignUp1/>}/>
        <Route path="/Login" element={<Login1/>}/>
        {/* <Route path="/" element={<SignUp />} />
        <Route path="/Login" element={<LoginPage />} /> */}
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/otpVerification" element={<OTPVerification />} />
      </Routes>
    </div>
  ) 
}