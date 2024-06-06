import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../Components/otpVerificationcss.css'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const [token, setToken] = useState(null);
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [clicked, setClicked] = useState(false);
    const navigate=useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                setClicked(true);
                const queryParams = new URLSearchParams(location.search);
                const token = queryParams.get('token');
                if (!token) {
                    setToken(false);
                    return;
                }
                const res = await axios.post("/verifytoken", { token });
                console.log("res in resetpassword: ", res);
                setClicked(false);
                setToken(token); // Or any other logic you want to implement based on the response
            } catch (err) {
                setClicked(false);
                console.log("error in resetpassword : ", err.message);
                setToken(false);
            }
        };

        verifyToken();
    }, [location]);
    async function handleSubmit(e) {
        try{
            e.preventDefault();
            
            if(password!==confirmPassword){
                toast.warning("Password Doesnot match");
                return;
            }
            const res=await axios.put("/resetpassword",{token,password});
            console.log(res);
            navigate("/Login");
        }catch(err){
            toast.error("something wrong!");
            console.log(err.message);
            return;
        }
        
    }
    return (
        <div>
            {token ? (
                <div className="container">
                    <header>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                    </header>
                    <h4>Reset Password</h4>
                    <form method='post' onSubmit={handleSubmit}>
                        <input type='text' required onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        <input type='text' required onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password' />
                        <button disabled={clicked} onClick={handleSubmit} className='btn'>Password Reset</button>
                        {
                            clicked && <div className='loader'></div>
                        }
                    </form>
                </div>

            ) : (
                <div className='container text-3xl '>Invalid or missing token.</div>
            )}
        </div>
    );
};

export default ResetPassword;
