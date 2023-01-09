import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import postsReducer from './postsSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer
  }
});

export default store;