import axios from 'axios';
import { REGISTER_CHALLANGE_REQUEST, REGISTER_CHALLANGE_SUCCESS,REGISTER_CHALLANGE_FAIL, CLEAR_ERRORS } from "../constants/authConstant";

//Regiser bio auth chanllange
export const registerChallange = () => async (dispatch, getState) => {

    try {
        dispatch({type: REGISTER_CHALLANGE_REQUEST});
    
        const { data } = await axios.post(`api/v1/bioauth/register-challenge`);
    
        dispatch({
            type: REGISTER_CHALLANGE_SUCCESS,
            payload:  data, 
        });


    } catch (error) {
        dispatch({
            type: REGISTER_CHALLANGE_FAIL,
            payload: error.response.data.message,
        });
    }

}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    })
}