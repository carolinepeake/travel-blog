import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
// import { ScrollArea, SimpleGrid, Container, useMantineTheme,  createStyles,  } from '@mantine/core';
import Post from './Post.js';

// const useStyles = createStyles((theme) => ({

//  root: {
//     display: 'grid',
//     gridGap: '10px',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
//   },

// }));

export default function Feed({ posts, setPosts, user, isLoggedIn, handleFilterPosts }) {
  // const theme = useMantineTheme();
  // const { classes, cx } = useStyles();
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
  }, []);


  return (
    <Container ref={grid} style={{ display: 'grid', gridGap: '16px', gridAutoRows: '25px'}}>
          {posts.map((post, i) => (
          <Post
          key={post._id} post={post} index={i} posts={posts} setPosts={setPosts} user={user} grid={grid} rowGap={rowGap} rowHeight={rowHeight} isLoggedIn={isLoggedIn}  handleFilterPosts={handleFilterPosts}></Post>
        ))}
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
`;


// journal: when did same useEffect as above, but console.log computedRowGap outside of useEffect, received null or undefined, or error (can't remember which).  To avoid, need to move console.log inside useEffect.  To then pass the computedRowGap value through to a child component, need to set a state property to the computedRowGap value and pass that state property to the child component. (see useEffect above)
 // journal: getting the computedRowHeight and computedRowGap did not work outside of useEffects, probably because the value was being set before the component finished rendering

  // journal:
  // function resizeGridItem(item) {
  //   grid = document.getElementsByClassName("grid")[0];
  //   rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  //   rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  //   rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
  //   item.style.gridRowEnd = "span "+rowSpan;
  // };

  // journal: how to useRef, can select by id,  and how to getComputedStyles (method, useEffect, ref, and need to set via inline styles (or prolly css stylesheet?))

 // journal:
 // <Container id="testGrid" ref={grid}/>
    // selecting DOM node by id returns the element and child elements (node?)
    // const testGrid = document.getElementById('testGrid');
    // console.log('testGrid: ', testGrid, 'type of testGrid: ', typeof testGrid);
    // but selecting DOM node by react useRef() returns the HTML element


    // both are objects (typeof)