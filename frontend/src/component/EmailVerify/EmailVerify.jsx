import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../images/success.png";
import failure from "../../images/failure.png";
import "./EmailVerify.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../../actions/userAction";
import { useAlert } from "react-alert";

const EmailVerify = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id, verificationToken } = useParams();
  const { loading, emailVerified, error } = useSelector(
    (state) => state.profile
  );

  const handleResendClick = async () => {
    const { data } = await axios.post(
      `/api/v1/email-verification/generate-email/${id}`
    );
    if (data.mailSent) {
      alert.success(
        "A verification email has been sent. Please check your inbox (or spam folder) and follow the instructions to verify your email."
      );
    }
  };

  useEffect(() => {
    dispatch(verifyEmail(verificationToken));
    if (error) {
      alert.error(error);
      alert.error("Email Not Verified, Try Again.");
    }
  }, [alert, dispatch, error, verificationToken]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {emailVerified && (
            <>
              <div className="email-verified-container">
                <div className="email-verified-content">
                  <img
                    src={success}
                    alt="Email verified successfully"
                    className="success"
                  />
                  <h1>Email Verified Successfully!</h1>
                  <p>
                    Thank you for verifying your email address. You can now
                    access all the features of our platform.
                  </p>
                  <Link to="/login" className="login-link">
                    Go to Login
                  </Link>
                </div>
              </div>
            </>
          )}
          {emailVerified === false && (
            <>
              <div className="email-verified-container">
                <div className="email-verified-content">
                  <img
                    src={failure}
                    alt="Email not verified! Please Try Again."
                    className="success"
                  />
                  <h1 className="red-colour">
                    Email Verification Unsuccessful! Please Try Again.
                  </h1>
                  <p>You can resend the email by clicking the button below:</p>
                  <button onClick={handleResendClick} className="resend-button">
                    Resend Email
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EmailVerify;
