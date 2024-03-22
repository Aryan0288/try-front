import React, { useContext } from 'react'
// import Register from './RegisterAndLogin.jsx';
import { UserContext } from './UserContext.jsx';
import SignUp from './SignUp.jsx';
import Chat from './Chat.jsx';
import LoginPage from './LoginPage.jsx'
import {Route,Routes} from 'react-router-dom';
import OTPVerification from './Components/otpVerification.jsx';


export default function RoutesPath() {
  // const {username,id}=useContext(UserContext);

  // if(username){
  //   return <Chat/>;
  // }

  return (
    // <Register/>
    // <div className='bg-[#000814]'>
    //   <SignUp/>
    // </div>


    <div>
      <div className='bg-[#000814]'>
        {/* <SignUp/> */}
      </div>
      <Routes>
        <Route path="/" element={<SignUp/>}/>
        <Route path="/Login" element={<LoginPage/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/otpVerification" element={<OTPVerification/>}/>
      </Routes>
    </div>
  )
}