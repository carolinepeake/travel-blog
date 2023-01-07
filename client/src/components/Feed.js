import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Post } from './Post.js';
import {
  fetchPosts, selectAllPosts
} from '../state/postsReducer.js';
import { Text } from '@mantine/core';
import { StyledSpinner } from './Spinner.js';


export default function Feed({ user, isLoggedIn }) {
  const grid = useRef();
  const [rowGap, setRowGap] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  // const [styles, setStyles] = UseState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const computedRowGap = parseInt(window
      .getComputedStyle(grid.current)
      .getPropertyValue("grid-row-gap"));
    const computedRowHeight = parseInt(window
      .getComputedStyle(grid.current)
      .getPropertyValue('grid-auto-rows'));
    setRowGap(computedRowGap);
    setRowHeight(computedRowHeight);
  }, []);

  // const [nothingFound, setNothingFound] = useState(false);

  // should be caching all posts and using database to filter!!!!

  let posts = useSelector(selectAllPosts);


  // const renderedPosts = posts.map(post => (
  //   <div className={classes.grid-item} key={post._id}>
  //     <Post post={post} />
  //   </div>
  // ));



  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);

  // useEffect(() => {
  //   if (postStatus === 'idle') {
  //     dispatch(fetchPosts())
  //   }
  // }, [postStatus, dispatch]);


  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, []);

  let content;

  if (postStatus === 'loading') {
    // content = <StyledSpinner text="Loading..." />
    content = <Text>Loading...</Text>;
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    content = orderedPosts.map(post => (
      <Post key={post._id} post={post} user={user} grid={grid} rowGap={rowGap} rowHeight={rowHeight} isLoggedIn={isLoggedIn} />
    ))
  } else if (postStatus === 'failed') {
    content = <Text>Sorry, no posts match your search</Text>
    // content = <div>{error}</div>
  };


  // useEffect(() => {
  //   if (!(posts.length >= 1)) {
  //     setNothingFound(true);
  //     return;
  //   }
  //   setNothingFound(false);
  // }, [posts]);

  // !!may want to do this way instead to avoid entire feed re-rendering every time a post changes (https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns)
  // import { selectPostIds } from './postsReducer';
  // const postIds = useSelector(selectPostIds);
  // const renderedPosts = postIds.map(postId => <Post key={postId} id={postId}/>);


  return (
    <Container ref={grid} style={{ display: 'grid', gridGap: '16px', gridAutoRows: '25px'}}>
       {/* {nothingFound && <Text>Sorry, no posts match your search</Text>} */}
          {/* {posts.map((post, i) => (
          <Post
          key={post._id} post={post} index={i} posts={posts} setPosts={setPosts} user={user} grid={grid} rowGap={rowGap} rowHeight={rowHeight} isLoggedIn={isLoggedIn}  handleFilterPosts={handleFilterPosts}></Post>
        ))} */}
        {content}
    </Container>
  );
};

const Container = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  height: 100%;
  position: relative;
  z-Index: -1;
`;

