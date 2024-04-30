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

    // const baseUrl = "https://try-backend-k7qt.onrender.com"
    // const url = `${baseUrl}/verify`
    const handleSubmit = async () => {
        // let dataLs=JSON.parse(localStorage.getItem("temp"));
        // if (otp.length == 0) {
        //     toast.warning("Enter Otp");
        //     return;
        // }
        // if (otp == dataLs.otp) {
        //     let email=dataLs.email;
        //     const response = await axios.post("verify", { email });
        //     toast.success("User Created Successfully", {
        //         position: "top-center",
        //     });
        //     localStorage.removeItem("temp");
        //     navigate("/Login");
        // }
        // else {
        //     toast.error("Enter Valid Otp");
        //     console.log("error in otpVerification")
        // }

        const otpData = JSON.parse(localStorage.getItem("temp"));
        if (otp.length == 0) {
            toast.warning("Enter Otp");
            return;
        }
        else if (otp == otpData.otpLs) {
            let emailLs = otpData.email;
            const response = await axios.put("/verify", { emailLs });
            toast.success("User Created Successfully", {
                position: "top-center",
            });
            localStorage.removeItem("temp");
            navigate("/Login");
        }
        else {
            toast.error("Enter Valid Otp");
            console.log("error in otpVerification")
        }
    };

    // console.log(otp);


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
