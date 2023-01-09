import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { createSelector } from 'reselect';
import axios from 'axios';

// HELPER FUNCTIONS

// const initialState = postsAdapter.getInitialState({
//   status: 'idle',
//   error: null,
// });

// ASYNC FUNCTIONS

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (filter = {}) => {
//   const response = await axios.get('/posts', { params: filter});
//   return response.data;
// });

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('/posts');
  return response.data;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost = {}) => {
  const response = await axios.post('/posts', initialPost);
  return response.data;
});


export const deletePost = createAsyncThunk('posts/deletePost', async (postId = '') => {
   const response = await axios.delete(`/posts/${postId}`);
   return response.data;
});


const initialState = {
  posts: [],
  status: 'idle',
  error: null,
  filter: {
    type: 'none',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    filterSet(state, action) {
      console.log('action payload :', action.payload);
      state.filter = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched posts to the array
        // state.posts = state.posts.concat(action.payload)
        state.posts = state.posts.concat(action.payload);
        state.posts = [...action.payload];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log('error fetchingPosts: ', action.error.message);
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // this should all to all posts array, not filtered
        state.posts.concat(action.payload);
        //state.posts.push(action.payload);
        //  = [action.payload].concat(state.posts);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload.postId);
      })
  }
});

export const { filterSet } = postsSlice.actions;

export default postsSlice.reducer

// SELECTOR FUNCTIONS

// can we selectOrderedPosts? const orderedPosts = posts
      // .slice()
      // .sort((a, b) => b.date.localeCompare(a.date))

// const date =  new Date(post.createdAt);

// export const selectAllPosts = state => state.posts.posts.sort((a, b) => b.date.localeCompare(a.date));

export const selectAllPosts = state => state.posts.posts;

// .sort((a, b) => {

//   return bDate.localeCompare(aDate);
// });

// export const selectOrderedPosts = createSelector(
//   selectAllPosts,
//   (posts) => {
//     if (posts.length === 0) {
//       return posts;
//     }
//   }
// );

// export const selectPostIds = createSelector(
//   selectAllPosts,
//   posts => {
//     // const date =  new Date(post.createdAt);
//     return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(post => post._id);
//   }
// );

// export const selectPostById = (state, postId) => {
//   return selectAllPosts(state).find(post => post._id === postId)
// };

export const selectFilter = state => state.posts.filter;

export const selectFilteredPosts = createSelector(
  selectAllPosts,
  selectFilter,

  (posts, filter) => {
    if (filter.type === 'none') {
      return posts;
    }

    // const { [type]: value } = filter; // correct destructing syntax // could have multiple (e.g., scuba or hiking, or hiking and mexico) filters in the future

    if (filter.type === 'tags') {
      return posts.filter(post => post.tags.includes(filter.value));
    }

    if (filter.type === 'bucketList') {
      return posts.filter(post => filter.value.includes(post._id));
    }

    return posts.filter(post => post[filter.type] === filter.value);
  }
);

export const selectFilteredPostIds = createSelector(
  selectFilteredPosts,
  (posts) => {
    const orderedPosts = posts
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return orderedPosts.map(post => post._id);
  }
);

export const selectFilteredPostById = (state, postId) => {
  return selectFilteredPosts(state).find(post => post._id === postId)
};

export const selectAllTags = createSelector(
  selectAllPosts,
  (posts) => {
    const nestedTags = posts.map((post) => post.tags);
    const tagsWithDuplicates = nestedTags.flat();
    const uniqueTags = [...new Set(tagsWithDuplicates)];
    return uniqueTags;
  }
);


