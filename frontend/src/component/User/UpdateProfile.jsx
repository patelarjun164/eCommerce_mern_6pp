import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import DefaultProfilePic from '../../images/Profile.png';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import Metadata from '../layout/MetaData';
import './UpdateProfile.css';

import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updateProfile, loadUser } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import Loader from '../layout/Loader/Loader';

const UpdateProfile = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState(DefaultProfilePic);

    const registerSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);

        dispatch(updateProfile(myForm));
    }

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url)
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Profile Update Successfully");
            dispatch(loadUser());
            navigate('/account');

            dispatch({
                type: UPDATE_PROFILE_RESET,
            });
        }

    }, [dispatch, error, alert, isUpdated, navigate, user]);

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <Metadata title="Update Profile" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className='updateProfileHeading'>Update Profile</h2>
                            <form className="updateProfileForm" encType='multipart/form-data' onSubmit={registerSubmit}>
                                <div className="updateProfileName">
                                    <FaceIcon />
                                    <input
                                        type='text'
                                        placeholder='Update Name'
                                        required
                                        name='name'
                                        value={name}
                                        onChange={(e)=> setName(e.target.value)}
                                    />
                                </div>
                                <div className="updateProfileEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        required
                                        name='email'
                                        value={email}
                                        onChange={(e)=> setEmail(e.target.value)}
                                    />
                                </div>

                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt='Avatar Preview' />
                                    <input
                                        type='file'
                                        name='avatar'
                                        accept='image/*'
                                        onChange={updateProfileDataChange}
                                    />
                                </div>

                                <input
                                    type='submit'
                                    value="Update Profile"
                                    className='updateProfileBtn'
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UpdateProfile;
