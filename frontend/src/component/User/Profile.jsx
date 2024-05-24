import React, { useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import Metadata from '../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import './Profile.css';
import { clearErrors, registerChallange } from '../../actions/authAction';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const { error } = useSelector(state => state.auth)

    useEffect(() => {
        if (isAuthenticated === false) {
          navigate("/login");
        }
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
      }
      }, [dispatch, error, isAuthenticated, navigate]);

      const handleBioRegister = () => {
          console.log(dispatch(registerChallange()));

      }
      return (
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Metadata title={`${user.name}'s Profile`} />
              <div className="profileContainer">
                <div>
                  <h1>My Profile</h1>
                  <img src={user.avatar.url} alt={user.name} />
                  <Link to="/me/update">Edit Profile</Link>
                </div>
                <div>
                  <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substring(0, 10)}</p>
                  </div>
    
                  <div>
                    <button onClick={handleBioRegister}>Register Biometrics</button>
                    <Link to="/orders">My Orders</Link>
                    <Link to="/password/update">Change Password</Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      );
}

export default Profile
