import React, { useState, useContext } from 'react'
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { UserContext } from './UserContext';
import { toast } from 'react-toastify'
import TypedText from './TypeText';
import { Link, useNavigate } from 'react-router-dom';


const SignUp = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUsername: setLoggedInUsername, setId, setEmail: setLoggedEmail } = useContext(UserContext);

    const [pass, setpass] = useState(false);


    async function submitHandler(event) {
        console.log("login Page");
        event.preventDefault();
        try {
            localStorage.removeItem("token");
            const { data } = await axios.post("/login", { username, password });
            console.log("data: ",data);
            const storeLocalStorage={
                username:data.foundUser.username,
                id:data.foundUser._id,
                email:data.foundUser.email,
            }
            localStorage.setItem("token",JSON.stringify(storeLocalStorage));

            setLoggedInUsername(data.foundUser.username);
            setId(data.foundUser._id);
            setLoggedEmail(data.foundUser.email);

            toast.success(`${data.message}`, {
                position: "top-center"
            });
            navigate("/chat");  
        }
        catch (err) {
            console.log("i am in err " + err);
            if(err.message.includes("401")){
                toast.warning('User Notfound');
                return;
            }else{
                toast.warning('Try After sometime');
                return;
            }
            toast.warning('Error Occur');
            return;
        }
    }



    return (
        <div className='flex md:flex-row flex-col w-full h-screen bg-[#000814]'>
            <form method='post' onSubmit={submitHandler} className='flex flex-col gap-5 w-full text-white text-[18px]'>
                <div className='flex flex-col gap-3 xl:w-8/12 w-11/12 mx-auto mt-[4rem]'>
                    <div className='text-3xl mb-[5rem] text-yellow-400'>
                        <TypedText />
                    </div>
                    <div className='flex gap-4'>

                        <label className='w-full'>
                            <p>UserName or Email <sup className='text-red-500 text-[14px] font-bold'> *</sup></p>
                            <input
                                className='p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
                                required
                                type='text'
                                name='username'
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='UserName'
                                value={username}
                                autoComplete='new-name'
                            />
                        </label>
                    </div>

                    <div className='flex gap-4'>
                        <label className='w-full relative'>

                            <p>Create Password <sup className='text-red-500 text-[14px] font-bold'>*</sup></p>
                            <input
                                className='p-2 mt-1 rounded-md border-b-2 border-b-slate-700 outline-[0.5px] w-full bg-slate-700/90'
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
            </form>
            <div className='max-md:hidden'>
                <img className='h-full  bg-cover' src='https://assets-global.website-files.com/5ee715da7b6fbc3bf68c6bfe/64918c2270e6f03c6d5ae3b2_tutorial_building-a-jetpack-compose-chat-app.jpg' />
            </div>


        </div>
    )
}
export default SignUp