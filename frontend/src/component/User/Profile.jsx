import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Metadata from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { bioAuthRegister, clearErrors } from "../../actions/userAction";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const {error, bioAuthRegistered} = useSelector((state) => state.userBioAuth);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if(bioAuthRegistered){
      alert.success("Biometrices Registered successfully for this device...!");
    }

    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [alert, bioAuthRegistered, dispatch, error, isAuthenticated, navigate]);

  const handleBioRegister = async () => {
    try {
      dispatch(bioAuthRegister());
    } catch (error) {
      alert.error("Biometric Registration Failed!!!");
    }
  };

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
                <p>{`${String(user.createdAt).substring(0, 10)} (yyyy-mm-dd)`}</p>
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
};

export default Profile;
