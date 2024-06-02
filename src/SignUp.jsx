// import React, { useState, useContext } from 'react'
// import axios from 'axios';
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
// import { UserContext } from './UserContext';
// import { toast } from 'react-toastify'
// import TypedText from './TypeText';

// const SignUp = ({ setIsLoggedIn }) => {

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [confirmPassword, setconfirmPassword] = useState('');
//   const { setUsername: setLoggedInUsername, setId, setEmail: setLoggedEmail } = useContext(UserContext);



//   const [pass, setpass] = useState(false);
//   const [pass1, setpass1] = useState(false);

//   const baseUrl="http://localhost:4040"

//   async function submitHandler(event) {
//     console.log("data submit");
//     event.preventDefault();
//     if (isLoginRegister==='register' && password != confirmPassword) {
//       toast.warning('Password Doesnot Match');
//       return;
//     }
//     try {
//       console.log("api fetching..",isLoginRegister);
//       const url = isLoginRegister === 'register'?`${baseUrl}/register` : `${baseUrl}/login`;
//       // console.log("check url " + url);
//       const { data } = await axios.post(url, { username, password, email });

//       setLoggedInUsername(username);
//       setId(data.id);
//       setLoggedEmail(email);
//       toast.success(`Successfully ${url}`,{
//         position:"top-center"
//       });
//       console.log(email + " " + username + " " + password);
//     }
//     catch (err) {
//       console.log("i am in err" + err);
//       if (err.response && err.response.status === 400) {

//         toast.error('Email already registered',{
//           position:"top-center"
//         });
//         return;
//       }
//       toast.warning('Error Occur');
//     }
//   }


//   const [isLoginRegister, setIsLoginRegister] = useState('register');

//   return (
//     <div className='flex w-full h-screen'>
//       <form method='post' onSubmit={submitHandler} className='flex flex-col gap-5 w-full text-white text-[18px]'>
//         <div className='flex flex-col gap-3 w-8/12 mx-auto mt-[4rem]'>
//           <div className='text-3xl mb-[5rem] text-yellow-400'>
//             <TypedText />
//           </div>
//           <div className='flex gap-4'>

//             <label className='w-full'>
//               {
//                 isLoginRegister === 'register' ? (
//                   <p>UserName <sup className='text-red-500 text-[14px] font-bold'>*</sup></p>
//                 ) :
//                   (
//                     <p>UserName or Email <sup className='text-red-500 text-[14px] font-bold'> *</sup></p>
//                   )
//               }
//               <input
//                 className='p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
//                 required
//                 type='text'
//                 name='username'
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder='UserName'
//                 value={username}
//                 autoComplete='new-name'
//               />
//             </label>

//           </div>
//           <div>
//             {
//               isLoginRegister === 'register' && (
//                 <label className='w-full'>
//                   <p>Email Address <sup className='text-red-500 text-[14px] font-bold'>*</sup></p>

//                   <input
//                     className='p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
//                     required
//                     type='email'
//                     name='email'
//                     onChange={e => setEmail(e.target.value)}
//                     placeholder='Enter Your Email Address'
//                     value={email}
//                     autoComplete='new-email'
//                   />
//                 </label>
//               )
//             }
//           </div>

//           <div className='flex gap-4'>
//             <label className='w-full relative'>
//               {
//                 isLoginRegister === 'register' ? (
//                   <p>Create Password <sup className='text-red-500 text-[14px] font-bold'>*</sup></p>
//                 ) :
//                   (
//                     <p>Password <sup className='text-red-500 text-[14px] font-bold'>*</sup></p>
//                   )
//               }
//               <input
//                 className='p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
//                 type={pass ? ('text') : ('password')}
//                 name='password'
//                 value={password}
//                 placeholder='Enter Your Password'
//                 required
//                 onChange={e => setPassword(e.target.value)}
//                 autoComplete='new-password'
//               />
//               <span className='absolute right-2 text-[22px] top-10 cursor-pointer'
//                 onClick={() => setpass((prev) => !prev)}>
//                 {pass ? (<AiOutlineEyeInvisible />) : (<AiOutlineEye />)}
//               </span>
//             </label>
//             {
//               isLoginRegister === 'register' && (
//                 <label className='w-full relative'>
//                   <p>Confirm Password <sup className='text-red-500 text-[14px] font-bold'>*</sup></p>
//                   <input
//                     className='p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
//                     type={pass1 ? ('text') : ('password')}
//                     name='confirmPassword'
//                     value={confirmPassword}
//                     placeholder='Enter Your Password'
//                     required
//                     onChange={e => setconfirmPassword(e.target.value)}
//                   />
//                   <span className='absolute right-2 text-[22px] top-10 cursor-pointer '
//                     onClick={() => setpass1((prev) => !prev)}>
//                     {pass1 ? (<AiOutlineEyeInvisible />) : (<AiOutlineEye />)}
//                   </span>
//                 </label>
//               )
//             }

//           </div>


//           <div className='mt-2'>

//             <button className='w-full py-2 rounded-md text-black bg-yellow-400 font-semibold'>
//               {
//                 isLoginRegister === 'register' ? (
//                   "Create Account"
//                 ) :
//                   (
//                     "Sign In"
//                   )
//               }

//             </button>
//           </div>
//         </div>

//         <div className='text-center'>

//           {
//             isLoginRegister === 'register' &&
//             (
//               <div>
//                 Already a member?
//                 < button onClick={() => setIsLoginRegister('login')}>&nbsp; Login here</button>
//               </div>
//             )
//           }

//           {
//             isLoginRegister === 'login' &&
//             (
//               <div>
//                 Don't have an account?
//                 < button onClick={() => setIsLoginRegister('register')}> &nbsp;Register </button>
//               </div>
//             )
//           }
//         </div>
//       </form>
//       <div className=''>
//         <img className='h-full  bg-cover' src='https://assets-global.website-files.com/5ee715da7b6fbc3bf68c6bfe/64918c2270e6f03c6d5ae3b2_tutorial_building-a-jetpack-compose-chat-app.jpg' />
//       </div>


//     </div>
//   )
// }
// export default SignUp




















// signup page



import React, { useState, useContext } from 'react'
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { UserContext } from './UserContext';
import { toast } from 'react-toastify'
import TypedText from './TypeText';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';
import './SignUp.css'
import FreeSoloCreateOptionDialog from './FreeSoloCreateOptionDialog';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignUpBackground from './Components/SignUpBackground'
import './Components/btns/button.css'

// import dotenv from 'dotenv'
// dotenv.config();


const SignUp = ({ setIsLoggedIn }) => {
  const navigation = useNavigate(); 
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const { setOneTimePass, setUsername, setId, setEmail: setLoggedEmail } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);


  const [pass, setpass] = useState(false);
  const [pass1, setpass1] = useState(false);
  const [clicked, setClicked] = useState(false);


  async function submitHandler(event) {
    console.log("data submit");
    event.preventDefault();
    if (password != confirmPassword) {
      toast.warning('Password Doesnot Match');
      return;
    }

    try {
      setIsLoading(true);
      setClicked(true);

      // then signUp the new User

      let response = await axios.post("/sendotp", { email });
      toast.info(`Verify Email Address`);
      console.log("response of sendotp ", response);
      const LsData = {
        email,
        password,
        username
      }

      localStorage.setItem("temp", JSON.stringify(LsData));
      setIsLoading(false);
      setClicked(false);
      navigation("/otpVerification");

    }
    catch (err) {
      setClicked(false);
      setIsLoading(false);
      console.log("err ", err.message);
      if (err.message.includes("401")) {
        toast.error("User Already Exist");
      } else {
        toast.error("Try after sometime");
      }
      return;
    }
  }


  const defaultTheme = createTheme();
  return (
    <div>
      <Box sx={{ width: '100%', overflow: "hidden" }}>
        {isLoading &&
          <LinearProgress sx={{ height: "6px", borderRadius: "20px", overflow: "hidden" }} />
        }
      </Box>
      <div className='relative overflow-hidden  h-screen bg-[#000814]'>
        <div className='top-[5rem] mx-auto  pb-4 md:w-[40%] sm:w-[80%] w-[80%] flex justify-center items-center left-[2.5rem] md:left-[5rem] right-[5rem] absolute signin'>
          <div className='content '>
            <form method='post' onSubmit={submitHandler} className='form flex  flex-col gap-5 text-white text-[18px]'>
              <div className='flex flex-col gap-3 xl:w-9/12 w-10/12 mx-auto mt-[1rem]'>
                <div className='font-style text-3xl mb-[1rem] text-yellow-400'>
                  <TypedText />
                </div>
                <div className='flex gap-2'>

                  <label className='inputBox w-full'>
                    {/* <p>Username <sup className='text-red-500 text-[14px] font-bold'>*</sup></p> */}
                    <input
                      className='txt-font p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
                      type='text'
                      name='username'
                      onChange={(e) => setName(e.target.value)}
                      required
                      value={username}
                      autoComplete='new-name'
                    />
                    <i>Username</i>
                  </label>

                </div>
                <div>

                  <label className='inputBox w-full'>
                    {/* <p>Email Address <sup className='text-red-500 text-[14px] font-bold'>*</sup></p> */}

                    <input
                      className='txt-font p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
                      type='email'
                      name='email'
                      onChange={e => setEmail(e.target.value)}
                      required
                      value={email}
                      autoComplete='new-email'
                    />
                    <i>Email</i>
                  </label>

                </div>

                {/* <div className='flex lg:flex-row flex-col gap-4'> */}
                <label className='inputBox w-full relative'>
                  {/* <p>Create Password <sup className='text-red-500 text-[14px] font-bold'>*</sup></p> */}
                  <input
                    className='txt-font p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
                    type={pass ? ('text') : ('password')}
                    name='password'
                    value={password}
                    // placeholder='Password'
                    required
                    onChange={e => setPassword(e.target.value)}
                    autoComplete='new-password'
                  />
                  <span className=' absolute right-2 text-[22px] top-5 cursor-pointer'
                    onClick={() => setpass((prev) => !prev)}>
                    {pass ? (<AiOutlineEyeInvisible />) : (<AiOutlineEye />)}
                  </span>
                  <i>Password</i>
                </label>

                <label className='inputBox w-full relative'>
                  {/* <p>Confirm Password <sup className='text-red-500 text-[14px] font-bold'>*</sup></p> */}
                  <input
                    className='txt-font p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
                    type={pass1 ? ('text') : ('password')}
                    name='confirmPassword'
                    value={confirmPassword}
                    required
                    onChange={e => setconfirmPassword(e.target.value)}
                  />
                  <span className='absolute right-2 text-[22px] top-5  cursor-pointer '
                    onClick={() => setpass1((prev) => !prev)}>
                    {pass1 ? (<AiOutlineEyeInvisible />) : (<AiOutlineEye />)}
                  </span>
                  <i>Confirm Password</i>
                </label>


                {/* </div> */}


                <div className='mt-2'>

                  <button disabled={clicked} className={`${clicked && ""} w-full py-2 rounded-md text-black  font-semibold `}>
                    <nav>
                      <ul>
                        <li>
                          Sign Up
                          <span></span><span></span><span></span><span></span>
                        </li>
                      </ul>
                    </nav>
                  </button>
                  {/* <button disabled={clicked} className={`${clicked && "bg-yellow-300"} w-full py-2 rounded-md text-black bg-yellow-400 font-semibold hover:shadow-md hover:shadow-yellow-600 hover:transition-all duration-200 `}>
                    Create Account
                  </button> */}
                </div>
              </div>

              <div className='xl:w-9/12 w-8/12 mx-auto text-center'>


                <div>
                  Already a member?
                  <Link to={"/Login"}>
                    < button >&nbsp; Login here</button>
                  </Link>
                </div>



              </div>
            </form>
          </div>
        </div>
        <div className='w-full overflow-hidden '>
          <SignUpBackground />
        </div>

        {/* <div className='max-md:hidden flex justify-between'>
          <div className='w-[50%]'></div>
          <div className='w-[50%] h-screen relative'>
            <video autoPlay muted loop className='h-full w-full object-fill'>
              <source src='https://cdn.pixabay.com/video/2021/10/01/90426-624025026_large.mp4' type='video/mp4' />
            </video>
          </div>
        </div> */}

      </div>
    </div>
  )
}
export default SignUp