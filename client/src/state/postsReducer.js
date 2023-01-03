import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// HELPER FUNCTIONS

// const initialState = postsAdapter.getInitialState({
//   status: 'idle',
//   error: null,
// });

// ASYNC FUNCTIONS

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (filter = {}) => {
  const response = await axios.get('/posts', { params: filter});
  return response.data
});

//handle filter posts

// export const deletePost = createAsyncThunk('posts/getPosts', async(postId) => {
//    const response = await axios.delete('/posts/:postId');
//     console.log(`post ${post._id} deleted successfully`, response.data);
//     let old = [...posts];
//     await setPosts(() => {
//       old.splice(index, 1);
//       return old;
//     });
//   } catch (err) {
//     console.log(`error deleting post ${post._id}`, err);
//   }
// });

const initialState = {
  posts: [],
  status: 'idle',
  error: null
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched posts to the array
        // state.posts = state.posts.concat(action.payload)
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log('error fetchingPosts: ', action.error.message);
      })
  }
});

export default postsSlice.reducer

// SELECTOR FUNCTIONS

export const selectAllPosts = state => state.posts.posts;

export const selectPostsByAuthor = (state, authorId) =>
  state.posts.posts.find(post => post.author === authorId);