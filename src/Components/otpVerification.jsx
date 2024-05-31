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
                    <i className="bx bxs-check-shield"></i>
                </header>
                <h4>Enter OTP Code</h4>
                <form >
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
                    <button onClick={handleSubmit} className='btn'>Verify OTP</button>
                </form>
            </div>
        </div>
    );
};

export default otpVerification;
