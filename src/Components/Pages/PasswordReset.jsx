import React, { useState, useContext } from 'react'
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import '../btns/button.css';


import '../../SignUp.css'
import SignUpBackground from '../SignUpBackground';
import TypedText from '../../TypeText';

const SignUp = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pass, setpass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [clicked, setClicked] = useState(false);

    async function submitHandler(event) {
        setIsLoading(true);
        setClicked(true);
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
            setClicked(false);
            navigate("/");
        }
        catch (err) {
            setClicked(false);
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
                                <div className=''>

                                    <button disabled={clicked} className={`${clicked && ""} w-full py-2 rounded-md text-black  font-semibold `}>
                                        <nav>
                                            <ul>
                                                <li>
                                                    Reset Password
                                                    <span></span><span></span><span></span><span></span>
                                                </li>
                                            </ul>
                                        </nav>
                                    </button>

                                </div>
                            </div>

                            
                        </form>
                    </div>
                </div>

                <div className='md:w-[44vw] w-[100%] overflow-hidden '>
                    <SignUpBackground />
                </div>



            </div>
        </div >
    )
}
export default SignUp