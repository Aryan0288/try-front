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
        console.log("login Page");
        event.preventDefault();
        try {
            localStorage.removeItem("token");
            const { data } = await axios.post("/login", { username, password });
            console.log("data: ", data);
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
            navigate("/chat");
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
                <div className='max-md:top-[5rem] top-[8rem] md:left-[5rem] left-[3.5rem] right-[5rem] pb-4 md:w-[30%] sm:w-[80%] w-[70%] flex justify-center items-center absolute signin'>
                    <div className='content '>
                        {/* <form method='post' onSubmit={submitHandler} className='flex flex-col gap-5 text-white text-[18px]'>
                            <div className='flex flex-col gap-3 xl:w-9/12 w-10/12 mx-auto mt-[1rem]'>
                                <div className='text-3xl mb-[1rem] text-yellow-400'>
                                    <TypedText />
                                </div>
                                <div className='flex gap-2'>

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

                                <div className='flex gap-4'>
                                    <label className='inputBox w-full relative'>

                                        <input
                                            className='txt-font p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
                                            type={pass ? ('text') : ('password')}
                                            name='password'
                                            value={password}
                                            placeholder='Enter Your Password'
                                            required
                                            onChange={e => setPassword(e.target.value)}
                                            autoComplete='new-password'
                                        />
                                        <span className='absolute right-2 text-[22px] top-10 cursor-pointer'
                                            onClick={() => setpass((prev) => !prev)}>
                                            {pass ? (<AiOutlineEyeInvisible />) : (<AiOutlineEye />)}
                                        </span>
                                        <i>Password</i>
                                    </label>
                                </div>


                                <div className='mt-2'>

                                    <button className='w-full py-2 rounded-md text-black bg-yellow-400 font-semibold'>
                                        Sign In
                                    </button>
                                </div>
                            </div>

                            <div className='text-center'>
                                <div>
                                    Don't have an account?
                                    <Link to={"/"}>
                                        < button> &nbsp;Register </button>
                                    </Link>
                                </div>
                            </div>
                        </form> */}



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

                            <div className='text-center mb-5'>
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
                <ThemeProvider theme={defaultTheme}>
                    <Grid container component="main" sx={{ height: '100vh', marginLeft: "28%", lg: 'block', sm: 'none' }}>
                        <CssBaseline />
                        <Grid
                            item
                            xs={false}
                            sm={4}
                            md={18}
                            sx={{
                                backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: (t) =>
                                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: { md: 'block', sm: 'none' },
                            }}
                        />
                    </Grid>
                </ThemeProvider>


            </div>
        </div >
    )
}
export default SignUp