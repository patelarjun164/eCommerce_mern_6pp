import { REGISTER_CHALLANGE_REQUEST, REGISTER_CHALLANGE_SUCCESS,REGISTER_CHALLANGE_FAIL, CLEAR_ERRORS } from "../constants/authConstant";

export const authReducer = (state =  {} , action) => {
    switch (action.type) {
        case REGISTER_CHALLANGE_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case REGISTER_CHALLANGE_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            }

        case REGISTER_CHALLANGE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            }

        default:
            return state;
    }
};
