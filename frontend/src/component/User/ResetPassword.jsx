import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import { useParams } from 'react-router-dom';
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useNavigate } from "react-router-dom";
import usePasswordToggle from '../Hooks/usePasswordToggle';

const ResetPassword = () => {

  const { token } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [confirmPassInputType, confirmPassToggleIcon] = usePasswordToggle();
  const { error, loading, success } = useSelector((state) => state.forgotPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(token, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");

      navigate("/login");
    }
  }, [dispatch, error, alert, navigate, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Reset Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Password</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >

                <div className="resetPassword">
                  <LockOpenIcon />
                  <input
                    type={PasswordInputType}
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span className='pIcon'>{ToggleIcon}
                  </span>
                </div>

                <div className="resetPassword">
                  <LockIcon />
                  <input
                    type={confirmPassInputType}
                    placeholder="Confirm New Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className='pIcon'>{confirmPassToggleIcon}
                  </span>
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ResetPassword
