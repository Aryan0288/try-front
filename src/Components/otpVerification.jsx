import React from "react";
import { useState, useContext } from "react";
import './otpVerificationcss.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext.jsx';
import { toast } from "react-toastify";
import axios from "axios";

export default (props) => {
    let [otp, setOtp] = useState("");
    let [error, setError] = useState("");
    // const { setUsername: setLoggedInUsername, setId, setEmail: setLoggedEmail } = useContext(UserContext);
    const { oneTimePass, username, email } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const LsData = JSON.parse(localStorage.getItem("temp"));
            console.log('otp verify page');
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
        <div className='container'>
            <div className="heading text-3xl pb-5">

                <h1>OTP Validation</h1>
            </div>
            <input
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter 6 digit OTP"
                required
                className='input mt-10'
            />
            <button onClick={handleSubmit} className='submit'>Login</button>
            <h3 className='error'>{error}</h3>
        </div>
    );
};
