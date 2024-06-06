// import React from "react";
// import { useState, useContext } from "react";
// import './otpVerificationcss.css';
// import { useNavigate } from "react-router-dom";
// import { UserContext } from '../UserContext.jsx';
// import { toast } from "react-toastify";
// import axios from "axios";
// import OtpInput from 'react-otp-input';

// export default (props) => {
//     let [otp, setOtp] = useState("");
//     let [error, setError] = useState("");
//     // const { setUsername: setLoggedInUsername, setId, setEmail: setLoggedEmail } = useContext(UserContext);
//     const { oneTimePass, username, email } = useContext(UserContext);
//     const navigate = useNavigate();

//     const handleSubmit = async () => {
//         try {
//             const LsData = JSON.parse(localStorage.getItem("temp"));
//             console.log('otp verify page');
//             const res = await axios.post("/register", {
//                 name: LsData.username,
//                 email: LsData.email,
//                 password: LsData.password,
//                 otp: otp
//             });

//             toast.success("User Created Successfully", {
//                 position: "top-center",
//             });
//             console.log("response ", res);
//             navigate("/Login");
//         } catch (err) {
//             console.log("err occur in otpPage ", err.message);
//             if (err.message.includes("400")) {
//                 toast.warning("Enter valid Otp");
//             } else {
//                 toast.warning("try After sometime");
//             }
//             return;
//         }

//     };


//     return (
//         <div style={{marginTop:"12rem"}} className='flex  flex-col w-10/12 mx-auto items-center pt-[10rem] mt-12 border-2 border-red-900'>

//             <h1 style={{marginBottom:"3rem"}} >OTP Validation</h1>
//             <div className="heading text-3xl pb-5">

//             </div>
//             <input
//                 onChange={(event) => setOtp(event.target.value)}
//                 placeholder="Enter 6 digit OTP"
//                 required
//                 className='input mt-10'
//             />
//             <button onClick={handleSubmit} className='submit'>Login</button>
//             <h3 className='error'>{error}</h3>



//         </div>
//     );
// };




























import React, { useState, useEffect, useRef, useContext } from 'react';
import './otpVerificationcss.css'; // Assuming you have CSS for styling
import { UserContext } from '../UserContext.jsx';
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import axios from 'axios';


const otpVerification = () => {
    const [values, setValues] = useState(['', '', '', '']);
    const inputsRef = useRef([]);

    useEffect(() => {
        if (inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    }, []);

    const handleInput = (e, index) => {
        const value = e.target.value;

        if (value.length > 1) {
            return; // Prevent more than one character in an input field
        }

        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);

        // Focus on the next input if current input is not empty
        if (value !== '' && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1].disabled = false;
            inputsRef.current[index + 1].focus();
        }

        // Check if all inputs are filled
        const allFilled = newValues.every((val) => val !== '');
        const button = document.querySelector('button');
        if (allFilled) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    };


    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newValues = [...values];
            newValues[index] = '';
            setValues(newValues);

            if (inputsRef.current[index - 1]) {
                inputsRef.current[index - 1].focus();
            }
        }
    };





    const { oneTimePass, username, email } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        try {
            ev.preventDefault();
            const LsData = JSON.parse(localStorage.getItem("temp"));
            console.log('otp verify page');
            let otp = values[0] + "" + values[1] + "" + values[2] + "" + values[3];
            console.log("otp : ", otp);
            const res = await axios.post("/register", {
                name: LsData.username,
                email: LsData.email,
                password: LsData.password,
                otp: otp
            });

            toast.success("User Created Successfully", {
                position: "top-center",
            });
            console.log("response ", res);
            navigate("/Login");
        } catch (err) {
            console.log("err occur in otpPage ", err.message);
            if (err.message.includes("400")) {
                toast.warning("Enter valid Otp");
            } else {
                toast.warning("try After sometime");
            }
            return;
        }

    };

    return (
        <div className='whole'>
            <div className="container">
                <header>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                </header>
                <h4>Enter OTP Code</h4>
                <form>
                    <div className="input-field">
                        {values.map((value, index) => (
                            <input
                                key={index}
                                type="number"
                                value={value}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputsRef.current[index] = el)}
                                disabled={index !== 0 && values[index - 1] === ''}
                            />
                        ))}
                    </div>
                    <div className='w-[50%]'>
                        <button onClick={handleSubmit} className='btn'>Verify OTP</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default otpVerification;
