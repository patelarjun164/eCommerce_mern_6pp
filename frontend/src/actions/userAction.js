import api from "../api.js";

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    BIOAUTH_LOGIN_REQUEST,
    BIOAUTH_LOGIN_SUCCESS,
    BIOAUTH_LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    ALL_USER_REQUEST,
    ALL_USER_SUCCESS,
    ALL_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    CLEAR_ERRORS,
    BIOAUTH_REGISTER_REQUEST,
    BIOAUTH_REGISTER_SUCCESS,
    BIOAUTH_REGISTER_FAIL,
    EMAIL_VERIFICATION_SUCCESS,
    EMAIL_VERIFICATION_REQUEST,
    EMAIL_VERIFICATION_FAIL,
} from '../constants/userConstants';
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

//Login
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }

        const { data } = await api.post(
            `/api/v1/login`,
            { email, password },
            config,
        );

        if (data.mailSent) {
            dispatch({ type: LOGIN_FAIL, emailVerification: !data.mailSent })
        } else {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: data.user,
            })
        }
    } catch (error) {
        // console.log("error", error);
        dispatch({ type: LOGIN_FAIL, payload: error.response.data.message })
    }
}
//BioAuth Login
export const bioAuthLogin = (email) => async (dispatch) => {
    try {
        dispatch({ type: BIOAUTH_LOGIN_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } }

        const resp = await api.post("/api/v1/bioauth/generate-authentication-options", { email }, config);


        let asseResp = await startAuthentication(resp.data.options);
        // console.log("authResult",asseResp);

        const verificationResp = await api.post("/api/v1/bioauth/login-verify", { email: email, authResult: asseResp }, config);

        // console.log("verificationResp", verificationResp);
        if (verificationResp.data.mailSent) {
            dispatch({ type: LOGIN_FAIL, emailVerification: !verificationResp.data.mailSent })
        }
        else if (verificationResp.data.success) {
            dispatch({
                type: BIOAUTH_LOGIN_SUCCESS,
                payload: verificationResp.data.user,
            })
        }
    } catch (error) {
        // console.log("Error bioauth", error.response.data.message);
        let errorMessage = error.response.data.message;
        if (error.name === 'NotAllowedError') {
            errorMessage = "Authentication was canceled by the user or timed out. Please try again"
        }
        dispatch({ type: BIOAUTH_LOGIN_FAIL, payload: errorMessage })
    }
}

//Register
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = { headers: { "Content-Type": "multipart/form-data" } }

        const { data } = await api.post(
            `/api/v1/register`,
            userData,
            config,
        );

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        })


    } catch (error) {
        dispatch({ type: REGISTER_USER_FAIL, payload: error.response.data.message })
    }
}

//Bioauth Register
export const bioAuthRegister = () => async (dispatch) => {
    try {
        dispatch({ type: BIOAUTH_REGISTER_REQUEST });
        const resp = await api.get("/api/v1/bioauth/generate-registration-options");

        // Pass the options to the authenticator and wait for a response
        let attResp = await startRegistration(resp.data.options);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const verificationResp = await api.post("/api/v1/bioauth/verify-registration", { cred: attResp }, config);

        dispatch({
            type: BIOAUTH_REGISTER_SUCCESS,
            payload: verificationResp.data.verified
        });

    } catch (error) {
        let errorMessage;
        if (error.name === 'NotAllowedError') {
            errorMessage = "Registration was canceled by the user or timed out. Please try again"
        }
        else {
            errorMessage = error.message;
        }
        dispatch({ type: BIOAUTH_REGISTER_FAIL, payload: errorMessage });
    }
}

//Verify Email
export const verifyEmail = (verificationToken) => async (dispatch) => {
    try {
        dispatch({ type: EMAIL_VERIFICATION_REQUEST });

        const { data } = await api.post(`/api/v1/email-verification/verify-token/${verificationToken}`);

        dispatch({
            type: EMAIL_VERIFICATION_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({ type: EMAIL_VERIFICATION_FAIL, payload: error.response.data.message })
    }
}

//Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await api.get("/api/v1/me");

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message })
    }
}

//LogOut User
export const logout = () => async (dispatch) => {
    try {
        const config = {withCredentials: true }
        await api.post("/api/v1/logout", config);

        dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
        dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message })
    }
}

//Update Profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = { headers: { "Content-Type": "multipart/form-data" } };

        const { data } = await api.put(`/api/v1/me/update`, userData, config);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success,
        })

    } catch (error) {
        dispatch({ type: UPDATE_PROFILE_FAIL, payload: error.response.data.message })
    }
}

//Update Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await api.put(
            `/api/v1/password/update`,
            passwords,
            config
        );

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success,
        })

    } catch (error) {
        dispatch({ type: UPDATE_PASSWORD_FAIL, payload: error.response.data.message })
    }
}

//Forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await api.post('/api/v1/password/forgot', email, config);

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message,
        })

    } catch (error) {
        dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error.response.data.message })
    }
}

//Reset Password
export const resetPassword = (token = "", passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await api.put(
            `/api/v1/password/reset/${token}`,
            passwords,
            config
        );

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success,
        })

    } catch (error) {
        dispatch({ type: RESET_PASSWORD_FAIL, payload: error.response.data.message })
    }
}


export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    })
}

//Get All Users -- Admin
export const getAllUsers = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_USER_REQUEST });
        const { data } = await api.get("/api/v1/admin/users");

        dispatch({ type: ALL_USER_SUCCESS, payload: data.users });
    } catch (error) {
        dispatch({ type: ALL_USER_FAIL, payload: error.response.data.message })
    }
}

//Get User Details -- Admin
export const getUserDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: USER_DETAILS_REQUEST });
        const { data } = await api.get(`/api/v1/admin/user/${id}`);

        dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message })
    }
}

//Update User -- Admin
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await api.put(
            `/api/v1/admin/user/${id}`,
            userData,
            config
        );

        dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

//Delete User
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });

        const { data } = await api.delete(`/api/v1/admin/user/${id}`);

        dispatch({ type: DELETE_USER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};