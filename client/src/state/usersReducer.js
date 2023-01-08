import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//import { createSelector } from 'reselect';
import axios from 'axios';

// HELPER FUNCTIONS

// const initialState = postsAdapter.getInitialState({
//   status: 'idle',
//   error: null,
// });

// ASYNC FUNCTIONS

export const loginUser = createAsyncThunk('users/loginUser', async (loginBody = {}) => {
  const response = await axios.post('/users/login', loginBody);
  return response.data;
});

export const addNewUser = createAsyncThunk('users/addNewUser', async (initialUser = {}) => {
  const response = await axios.post('/users/signup', initialUser);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId = '') => {
   const response = await axios.delete(`/users/${userId}`);
   return response.data;
});

export const editAvatar = createAsyncThunk('users/likePost', async (userId = '', imageBody = {}) => {
  const response = await axios.put(`/users/${userId}/avatar`, imageBody);
  return response.data;
});

export const likePost = createAsyncThunk('users/likePost', async (userId = '', postId = '') => {
  const response = await axios.put(`/users/${userId}/like/${postId}`);
  return response.data;
});

export const unlikePost = createAsyncThunk('users/unlikePost', async (userId = '', postId = '') => {
  const response = await axios.put(`/users/${userId}/unlike/${postId}`);
  return response.data;
});

const initialState = {
  user: {},
  status: 'idle',
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logoutUser: state.user = {},
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log('error fetchingUser: ', action.error.message);
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.user = {};
      })
      .addCase(editAvatar.fulfilled, (state, action) => {
        state.user.avatar = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.user.bucketList = state.user.bucketList.unshift(action.payload._id);
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.user.bucketList = state.user.bucketList.filter(postId => postId !== action.payload._id);
      })

  }
});

export default userSlice.reducer

// SELECTOR FUNCTIONS

export const selectUser = state => state.user;

export const selectBucketList = state => state.user.bucketList;




