
import axios from 'axios';
import { UserContext, UserContextProvider } from './UserContext';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'

import './index.css' //css file 
import Chat from './Chat';
import { useContext } from 'react';

function App() {
  // wherever axios is used,this url will be utilized 
  // axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.baseURL = 'https://try-backend-ouni.onrender.com';
  axios.defaults.withCredentials = true;

  
  
  return (
    <div className='body'>
      <BrowserRouter>
        <UserContextProvider>
          <Routes /> 
          <ToastContainer />
        </UserContextProvider>
      </BrowserRouter>
    </div>

  );
}

export default App;