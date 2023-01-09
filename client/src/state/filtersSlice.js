import { createSlice } from '@reduxjs/toolkit';

//import { createSelector } from 'reselect';

// HELPER FUNCTIONS

export const StaFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

const initialState = {
  status: StatusFilters.All,
  tags: [],
}

const initialState = {
  type: 'none',
  value: '',
};

const filtersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logoutUser: state.user = {},
  },
  extraReducers(builder) {
    builder
      // .addCase(loginUser.pending, (state, action) => {
      //   state.status = 'loading';
      // })
      // .addCase(loginUser.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.user = action.payload;
      // })
      // .addCase(loginUser.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message;
      //   console.log('error fetchingUser: ', action.error.message);
      // })
      // .addCase(addNewUser.fulfilled, (state, action) => {
      //   state.user = action.payload;
      // })
      // .addCase(deleteUser.fulfilled, (state, action) => {
      //   state.user = {};
      // })
      // .addCase(editAvatar.fulfilled, (state, action) => {
      //   state.user.avatar = action.payload;
      // })
      // .addCase(likePost.fulfilled, (state, action) => {
      //   state.user.bucketList = state.user.bucketList.unshift(action.payload._id);
      // })
      // .addCase(unlikePost.fulfilled, (state, action) => {
      //   state.user.bucketList = state.user.bucketList.filter(postId => postId !== action.payload._id);
      // })

  }
});

export default userSlice.reducer

// SELECTOR FUNCTIONS

export const selectUser = state => state.user;

export const selectBucketList = state => state.user.bucketList;




