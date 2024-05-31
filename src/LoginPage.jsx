import React, { useState, useContext } from 'react'
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { UserContext } from './UserContext';
import { toast } from 'react-toastify'
import TypedText from './TypeText';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import './SignUp.css'
import SignUpBackground from './Components/SignUpBackground';

const SignUp = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUsername: setLoggedInUsername, setId, setEmail: setLoggedEmail } = useContext(UserContext);
    const [pass, setpass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    async function submitHandler(event) {
        setIsLoading(true);
        // console.log("login Page");
        event.preventDefault();
        try {
            localStorage.removeItem("token");
            const { data } = await axios.post("/login", { username, password });
            // console.log("data: ", data);
            const storeLocalStorage = {
                username: data.foundUser.username,
                id: data.foundUser._id,
                email: data.foundUser.email,
            }
            localStorage.setItem("token", JSON.stringify(storeLocalStorage));

            setLoggedInUsername(data.foundUser.username);
            setId(data.foundUser._id);
            setLoggedEmail(data.foundUser.email);

            toast.success(`${data.message}`, {
                position: "top-center"
            });
            setIsLoading(false);
            navigate("/");
        }
        catch (err) {
            setIsLoading(false);
            console.log("i am in err " + err);
            if (err.message.includes("401")) {
                toast.warning('User Notfound');
                return;
            } else {
                toast.warning('Try After sometime');
                return;
            }
            toast.warning('Error Occur');
            return;
        }
    }


    const defaultTheme = createTheme();
    return (
        <div>
            <Box sx={{ width: '100%' }}>
                {isLoading &&
                    <LinearProgress sx={{ height: "6px", borderRadius: "20px" }} />
                }
            </Box>
            <div className='flex overflow-hidden h-screen bg-[#000814]'>
                <div className='max-md:top-[5rem] top-[8rem] md:left-[5rem] left-[2.5rem] right-[5rem] pb-4 mx-auto md:w-[40%] sm:w-[80%] w-[80%] flex justify-center items-center absolute signin'>
                    <div className='content '>
                        <form method='post' onSubmit={submitHandler} className='form flex  flex-col gap-5 text-white text-[18px]'>
                            <div className='flex flex-col gap-3 xl:w-9/12 w-10/12 mx-auto mt-[2rem]'>
                                <div className='text-3xl mb-[1rem] text-yellow-400'>
                                    <TypedText />
                                </div>

                                <div>

                                    <label className='inputBox w-full'>
                                        <input
                                            className='txt-font p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
                                            required
                                            type='text'
                                            name='username'
                                            onChange={(e) => setUsername(e.target.value)}

                                            value={username}
                                            autoComplete='new-name'
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




                                {/* </div> */}


                                <div className='mt-2'>

                                    <button className='w-full py-2 rounded-md text-black bg-yellow-400 font-semibold'>
                                        Sign In
                                    </button>
                                </div>
                            </div>

                            <div className='xl:w-9/12 w-8/12 mx-auto text-center mb-5'>
                                <div>
                                    Don't have an account?
                                    <Link to={"/"}>
                                        < button> &nbsp;Register </button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='md:w-[44vw] w-[100%] overflow-hidden '>
                    <SignUpBackground />
                </div>
                {/* <div className='max-md:hidden flex justify-between'>
                    <div className='w-[0%]'></div>
                    <div className='w-[76%] h-screen relative'>
                        <video autoPlay muted loop className='h-full w-full object-fill'>
                            <source src='https://cdn.pixabay.com/video/2021/10/01/90426-624025026_large.mp4' type='video/mp4' />
                        </video>
                    </div>
                </div> */}


            </div>
        </div >
    )
}
export default SignUp