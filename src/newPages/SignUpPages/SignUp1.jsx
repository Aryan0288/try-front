import React, { useContext, useState } from 'react'
import signupimage from './images/signup-image.jpg'
import './css/style.css'
import './fonts/material-icon/css/material-design-iconic-font.min.css'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'
export default function () {
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


    return (
        <div className=''>
            <section class="signup">
                <div class="container">
                    <div class="signup-content">
                        <div class="signup-form">
                            <h2 class="form-title">Sign up</h2>
                            <form method="POST" onSubmit={submitHandler} class="register-form" id="register-form">
                                <div class="form-group">
                                    <label for="name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Your Name"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        value={username}
                                        autoComplete='new-name'
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="email"><i class="zmdi zmdi-email"></i></label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Your Email"
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        value={email}
                                        autoComplete='new-email'
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="pass"><i class="zmdi zmdi-lock"></i></label>
                                    <input
                                        type="password"
                                        name="pass"
                                        id="pass"
                                        placeholder="Password"
                                        value={password}
                                        required
                                        onChange={e => setPassword(e.target.value)}
                                        autoComplete='new-password'
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="re-pass"><i class="zmdi zmdi-lock-outline"></i></label>
                                    <input
                                        type="password"
                                        name="re_pass"
                                        id="re_pass"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        required
                                        onChange={e => setconfirmPassword(e.target.value)}
                                    />
                                </div>

                                <div className="form-group form-button">
                                    <input
                                        type="submit"
                                        name="signup"
                                        id="signup"
                                        class="form-submit"
                                        value="Register"
                                        disabled={clicked}
                                    />
                                    {
                                       clicked && <div className='loader'></div>
                                    }
                                    
                                </div>
                            </form>
                        </div>
                        <div class="signup-image">
                            <figure><img src={signupimage} alt="sing up image" /></figure>
                            <Link to="/Login">
                                <a href="" class="signup-image-link ">I am already member</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
