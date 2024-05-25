import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Metadata from "../layout/MetaData";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { startRegistration } from "@simplewebauthn/browser";
import axios from "axios";
import { useAlert } from "react-alert";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleBioRegister = async () => {
    try {
      const { data } = await axios.post("/api/v1/bioauth/register-challenge");
      const options = data.options;
      console.log(options);

      const authenticationResult = await startRegistration({ ...options });
      console.log("authenticationResult", authenticationResult);

      const verifyData = {
        cred: authenticationResult,
      };

      const config = { headers: { "Content-Type": "application/json" } };

      const resData = await axios.post(
        "/api/v1/bioauth/register-verify",
        verifyData,
        config
      );

      if (resData.data.verified) {
        alert.success("Biometrices Registered Successfully...!");
      }
    } catch (error) {
      alert.error("Biometric Registration Abort!!!");
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
};

export default Profile;
