import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { startAuthentication } from '@simplewebauthn/browser';

// Initial state
const initialState = {
    user: {},
    loading: false,
    isAuthenticated: false,
    error: null,
    isUpdated: false,
    isDeleted: false,
    message: null,
    users: [],
};

// Async thunks
export const login = createAsyncThunk('user/login', async ({ email, password }, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('/api/v1/login', { email, password }, config);
        return data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const bioAuthLogin = createAsyncThunk('user/bioAuthLogin', async (email, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('/api/v1/bioauth/login-challenge', { email }, config);
        const options = data.options;

        const authenticationResult = await startAuthentication(options);
        const verifyData = {
            email: email,
            cred: authenticationResult.id,
        };

        const resData = await axios.post('/api/v1/bioauth/login-verify', verifyData, config);
        if (resData.data.verified) {
            alert.success('Biometrices Registered Successfully...!');
        }

        return resData.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const register = createAsyncThunk('user/register', async (userData, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await axios.post('/api/v1/register', userData, config);
        return data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const loadUser = createAsyncThunk('user/loadUser', async (_, thunkAPI) => {
    try {
        const { data } = await axios.get('/api/v1/me');
        return data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const logout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
    try {
        await axios.get('/api/v1/logout');
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (userData, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await axios.put('/api/v1/me/update', userData, config);
        return data.success;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const updatePassword = createAsyncThunk('user/updatePassword', async (passwords, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.put('/api/v1/password/update', passwords, config);
        return data.success;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('/api/v1/password/forgot', email, config);
        return data.message;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const resetPassword = createAsyncThunk('user/resetPassword', async ({ token, passwords }, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config);
        return data.success;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const getAllUsers = createAsyncThunk('user/getAllUsers', async (_, thunkAPI) => {
    try {
        const { data } = await axios.get('/api/v1/admin/users');
        return data.users;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const getUserDetails = createAsyncThunk('user/getUserDetails', async (id, thunkAPI) => {
    try {
        const { data } = await axios.get(`/api/v1/admin/user/${id}`);
        return data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ id, userData }, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config);
        return data.success;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, thunkAPI) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearErrors(state) {
            state.error = null;
        },
        resetUpdate(state) {
            state.isUpdated = false;
        },
        resetDelete(state) {
            state.isDeleted = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(bioAuthLogin.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
            })
            .addCase(bioAuthLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(bioAuthLogin.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { clearErrors, resetUpdate, resetDelete } = userSlice.actions;
export default userSlice.reducer;
