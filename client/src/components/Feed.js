import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Text } from '@mantine/core';

import { Post } from './Post.js';
import { fetchPosts, selectFilteredPostIds, selectFilter, selectPostIds } from '../state/postsSlice.js';
import { selectBucketList } from '../state/usersSlice.js';

// import { StyledSpinner } from './Spinner.js';

const GRID_ROW_HEIGHT = 8;

export default function Feed() {

  const dispatch = useDispatch();
  const postStatus = useSelector(state => state.posts.status);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  const filter = useSelector(selectFilter);
  const filteredPostIds = useSelector(selectFilteredPostIds);
  const bucketList = useSelector(selectBucketList);
  const allPostIds = useSelector(selectPostIds);

  // should really make it so once post is deleted, reference is removed from all bucketLists
    // could also pass-on nonfiltered bucketList array of post ids and then return null from the post component if post id not found in allPostIds
      // (but rendering no posts found based on postIds.length)
  const postIds = filter.type === 'bucketList' ? bucketList.filter(postId => allPostIds.includes(postId)) : filteredPostIds;

  const error = useSelector(state => state.posts.error);

  const grid = useRef();
  const [rowGap, setRowGap] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);

  useEffect(() => {
    const computedRowGap = parseInt(window
      .getComputedStyle(grid.current)
      .getPropertyValue("grid-row-gap"));
    const computedRowHeight = parseInt(window
      .getComputedStyle(grid.current)
      .getPropertyValue('grid-auto-rows'));
    setRowGap(computedRowGap);
    setRowHeight(computedRowHeight);
  }, [postIds]);

  const [nothingFound, setNothingFound] = useState(false);

  useEffect(() => {
    if (postStatus === 'succeeded' && !(postIds.length >= 1)) {
      setNothingFound(true);
      return;
    }
    setNothingFound(false);
  }, [postIds]);

  let content;

  if (postStatus === 'loading') {
    // content = <StyledSpinner text="Loading..." />
    content = <Text>Loading...</Text>;

  } else if (postStatus === 'succeeded') {
    content = postIds.map(postId => (
      <Post
        key={postId}
        postId={postId}
        grid={grid}
        rowGap={rowGap}
        rowHeight={rowHeight}
       />
    ))

  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  };

  return (
    <Container
      ref={grid}
      gridRow={GRID_ROW_HEIGHT}
      cardPadding={4 * GRID_ROW_HEIGHT}
    >
      {nothingFound
      ? <Text>Sorry, no posts match your search</Text>
      : content}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
  grid-auto-rows: ${props => props.gridRow + 'px' || '16px'};
  grid-row-gap: ${props => props.gridRow + 'px' || '16px'};
  grid-column-gap: ${props => props.cardPadding + 'px' || '16px'};
  max-width: 968px;
  margin-left: auto;
  margin-right: auto;
  margin-top: ${props => props.cardPadding + 'px' || '16px'};
  margin-bottom: ${props => props.cardPadding + 'px' || '16px'};
  padding-left: ${props => props.cardPadding + 'px' || '16px'};
  padding-right: ${props => props.cardPadding + 'px' || '16px'};
  width: 100%;
  height: 100%;
  position: relative;
  z-Index: -1;
`;

// correct styles rendered given grid_row_height
  // can delete computed row gap use effect function
// nothing found text if no post ids
// shows loading state
// handles api error
// renders posts upon startup


