import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//import { createSelector } from 'reselect';
import axios from 'axios';

// HELPER FUNCTIONS

// const initialState = usersAdapter.getInitialState({
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

export const editAvatar = createAsyncThunk
//could destructure args and add default values
('users/editAvatar', async (args = {}) => {
  let userId = args.userId;
  const imageBody = { image: args.image };
  const response = await axios.put(`/users/${userId}/avatar`, imageBody);
  return response.data;
});

export const likePost = createAsyncThunk('users/likePost', async (ids = {}) => {
  let userId = ids.user;
  let postId = ids.post;
  console.log('postId from slice; ', postId);
  const response = await axios.put(`/users/${userId}/like/${postId}`);
  return response.data;
});

export const unlikePost = createAsyncThunk('users/unlikePost', async (ids = {}) => {
  let userId = ids.user;
  let postId = ids.post;
  console.log('postId from slice; ', postId);
  console.log('userId from slice; ', userId);
  const response = await axios.put(`/users/${userId}/unlike/${postId}`);
  return response.data;
});

const initialState = {
  user: {},
  status: 'idle',
  error: null,
  isLoggedIn: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logoutUser(state, action) {
      state.user = {},
      state.isLoggedIn = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log('error fetchingUser: ', action.error.message);
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.user = {};
        state.isLoggedIn = false;
      })
      .addCase(editAvatar.fulfilled, (state, action) => {
        state.user.avatar = action.payload.image;
      })
      // will want to make it so just adds postId to bucketList state rather than replacing bucketList state with fetched bucketList so if another post is unliked but db hasn't updated yet, is updated in state / so wrong post doesn't get deleted if quickly liking and unliking several posts
      .addCase(likePost.fulfilled, (state, action) => {
        // state.user.bucketList = state.user.bucketList.unshift(action.payload._id);
        state.user.bucketList = action.payload.bucketList;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        // state.user.bucketList = state.user.bucketList.filter(postId => postId !== action.payload._id);
        state.user.bucketList = action.payload.bucketList;
      })

  }
});

export const { logoutUser } = usersSlice.actions;

export default usersSlice.reducer

// SELECTOR FUNCTIONS

export const selectUser = state => state.users.user;

export const selectBucketList = state => state.users.user.bucketList;

export const selectLoggedInState = state => state.users.isLoggedIn;




