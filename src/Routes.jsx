import React, { useContext } from 'react'
// import Register from './RegisterAndLogin.jsx';
import { UserContext } from './UserContext.jsx';
import SignUp from './SignUp.jsx';
import Chat from './Chat.jsx';
import LoginPage from './LoginPage.jsx'
import { Route, Routes } from 'react-router-dom';
import OTPVerification from './Components/otpVerification.jsx';


export default function RoutesPath() {


  return (



    <div>
      <div className='bg-[#000814]'>

      </div>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/otpVerification" element={<OTPVerification />} />
      </Routes>
    </div>
  )
}