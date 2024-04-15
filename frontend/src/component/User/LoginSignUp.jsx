import './LoginSignUp.css';
// import Loader from '../layout/Loader/Loader';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DefaultProfilePic from '../../images/Profile.png';

const LoginSignUp = () => {
    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);
    const pIconLoginRef = useRef(null);
    const pIconSignUpRef = useRef(null);

    const [pIconToggle, setPIconToggle] = useState(true);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState(DefaultProfilePic);

    const changeLoginPIcon = () => {
        setPIconToggle(!pIconToggle);

        if (pIconLoginRef.current.type === "password") {
            pIconLoginRef.current.type = "text";
        } else if (pIconLoginRef.current.type === "text") {
            pIconLoginRef.current.type = "password";
        }
    }
    const changeSignUpPIcon = () => {
        setPIconToggle(!pIconToggle);

        if (pIconSignUpRef.current.type === "password") {
            pIconSignUpRef.current.type = "text";
        } else if (pIconSignUpRef.current.type === "text") {
            pIconSignUpRef.current.type = "password";
        }
    }

    const loginSubmit = () => {
        console.log("Login Form Submitted!!!");
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);

        console.log("Signup Form Submitted!!!");
    }

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    }

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    };

    return (
        <>
            <div className="LoginSignUpContainer">
                <div className="LoginSignUpBox">
                    <div>
                        <div className="login_signUp_toggle">
                            <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                            <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                        </div>
                        <button ref={switcherTab}></button>
                    </div>

                    <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                        <div className="loginEmail">
                            <MailOutlineIcon />
                            <input
                                type='email'
                                placeholder='Email'
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>

                        <div className="loginPassword">
                            <LockOpenIcon />
                            <input
                                ref={pIconLoginRef}
                                type='password'
                                placeholder='Enter Password'
                                required
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                            <span className='pIcon' onClick={changeLoginPIcon}>{
                                pIconToggle ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>

                        <Link to="/password/forgot">Forget Password?</Link>
                        <input type='submit' value='Login' className="loginBtn" />
                    </form>

                    <form className="signUpForm" ref={registerTab} onSubmit={registerSubmit}>
                        <div className="signUpName">
                            <FaceIcon />
                            <input
                                type='text'
                                placeholder='Name'
                                required
                                name='name'
                                value={name}
                                onChange={registerDataChange}
                            />
                        </div>
                        <div className="signUpEmail">
                            <MailOutlineIcon />
                            <input
                                type='email'
                                placeholder='Email'
                                required
                                name='email'
                                value={email}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>

                        <div className="signUpPassword">
                            <LockOpenIcon />
                            <input
                                ref={pIconSignUpRef}
                                type='password'
                                placeholder='Password'
                                name='password'
                                required
                                value={password}
                                onChange={registerDataChange}
                            />
                            <span className='pIcon' onClick={changeSignUpPIcon}>{
                                pIconToggle ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>

                        <div id="registerImage">
                            <img src={avatarPreview} alt='Avatar Preview' />
                            <input
                                type='file'
                                name='avatar'
                                accept='image/*'
                                onChange={registerDataChange}
                            />
                        </div>

                        <input
                            type='submit'
                            value="Register"
                            className='signUpBtn'
                        />
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginSignUp;
