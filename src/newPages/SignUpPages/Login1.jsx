import React, { useContext, useState } from 'react'
import './css/style.css'
import './fonts/material-icon/css/material-design-iconic-font.min.css'
import image from './images/signin-image.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import { toast } from 'react-toastify'
import axios from 'axios'
export default function Login1() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUsername: setLoggedInUsername, setId, setEmail: setLoggedEmail } = useContext(UserContext);
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

    return (
        <div>
            <section class="sign-in">
                <div class="container">
                    <div class="signin-content">
                        <div class="signin-image">
                            <figure><img src={image} alt="sing up image" /></figure>
                            <Link to="/">
                                <a href="#" class="signup-image-link">Create an account</a>
                            </Link>
                        </div>

                        <div class="signin-form">
                            <h2 class="form-title">Sign In</h2>
                            <form method="POST" onSubmit={submitHandler} class="register-form" id="login-form">
                                <div class="form-group">
                                    <label for="your_name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                    <input
                                        type="text"
                                        name="your_name"
                                        id="your_name"
                                        placeholder="Enter your email"
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        value={username}
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="your_pass"><i class="zmdi zmdi-lock"></i></label>
                                    <input
                                        type="password"
                                        name="your_pass"
                                        id="your_pass"
                                        placeholder="Password"
                                        value={password}
                                        required
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <div class="form-group">
                                    <input type="checkbox" name="remember-me" id="remember-me" class="agree-term" />
                                </div>
                                <div class="form-group form-button">
                                    <input
                                        type="submit"
                                        name="signin"
                                        id="signin"
                                        class="form-submit"
                                        value="Log in"
                                        disabled={clicked}
                                    />
                                    {
                                        clicked && <div className='loader'></div>
                                    }
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
