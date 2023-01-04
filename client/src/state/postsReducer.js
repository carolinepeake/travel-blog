import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { createSelector } from 'reselect';
import axios from 'axios';

// HELPER FUNCTIONS

// const initialState = postsAdapter.getInitialState({
//   status: 'idle',
//   error: null,
// });

// ASYNC FUNCTIONS

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (filter = {}) => {
  const response = await axios.get('/posts', { params: filter});
  return response.data;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost = {}) => {
  const response = await axios.post('/posts', initialPost);
  return response.data;
});

//handle filter posts

export const deletePost = createAsyncThunk('posts/deletePost', async (postId = '') => {
   const response = await axios.delete(`/posts/${postId}`);
   return response.data;
});
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

// const handleDeletePost = async (post, e) => {
//   // may not be necessary
//   e.preventDefault();
//   try {
//     const response = await axios.delete(`http://localhost:3001/posts/${post._id}`);
//     console.log(`post ${post._id} deleted successfully`, response.data);
//     let old = [...posts];
//     await setPosts(() => {
//       old.splice(index, 1);
//       return old;
//     });
//   } catch (err) {
//     console.log(`error deleting post ${post._id}`, err);
//   }
// };

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
      .addCase(addNewPost.fulfilled, (state, action) => {
        // this should all to all posts array, not filtered
        state.posts = state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload._id);
      })
  }
});

export default postsSlice.reducer

// SELECTOR FUNCTIONS

// can we selectOrderedPosts? const orderedPosts = posts
      // .slice()
      // .sort((a, b) => b.date.localeCompare(a.date))

export const selectAllPosts = state => state.posts.posts;

export const selectPostIds = createSelector(
  selectAllPosts,
  posts => posts.map(post => post._id)
);

// can use the memoized selectPostIds as input selector in selectPostById selector
export const selectPostById = (state, postId) => {
  return selectAllPosts(state).find(post => post._id === postId)
};

export const selectFilteredPosts = createSelector(
  selectAllPosts,
  state => state.filter, // need to add

  (posts, filter) => {
    if (filter === {}) {
      return posts;
    }

    const { [type]: value } = filter; // correct destructing syntax // could have multiple (e.g., scuba or hiking, or hiking and mexico) filters in the future

    if (type === 'tags') {
      return posts.filter(post => post.tags.includes(value))
    }

    return posts.filter(post => post[type] === value);
  }
);

export const selectFilteredPostIds = createSelector(
  selectFilteredPosts,
  filteredPosts => filteredPosts.map(post => post._id)
);
