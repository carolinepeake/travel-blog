import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';

import { Post } from './Post.js';


export default function MasonaryLayout({posts, setPosts, user, isLoggedIn}) {
  const grid = useRef();
  const [rowGap, setRowGap] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  // const [styles, setStyles] = useState({});
  // const content = useRef();

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

  // function resizePost() {
  //   const contentHeight = parseInt(window
  //     .getComputedStyle(ref.current)
  //     .getPropertyValue("height"));
  //   let rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
  //   setGridRowSpan(rowSpan);
  // };

  // useEffect(() => {
  //   resizePost()
  // }, []);

   // would need to move this function to Feed component (parent) and either use forwardRef() or make Post a class component to make a DOM ref to it that is usable in Feed (parent) component.  Or possibly could use getElementsByClassName but not sure
  // function resizeAllGridItems(){
  //   const allItems = document.getElementsByClassName("item");
  //   for (let x=0; x < allItems.length; x++){
  //     resizeGridItem(allItems[x]);
  //   }
  //   console.log('allItems: ', allItems);
  // };

  // function resizeInstance(instance){
  //   item = instance.elements[0];
  //   resizeGridItem(item);
  // };

// window.onload = resizeAllGridItems();

//(wasn't in blog post)
// useEffect(() => {
//   resizeAllGridItems();
// }, []);

// window.addEventListener("resize", resizeAllGridItems);

// allItems = document.getElementsByClassName("item");
// for (let x=0; x < allItems.length; x++) {
//   imagesLoaded( allItems[x], resizeInstance);
// }

// const testItem = document.getElementById(`${post._id}`);
// console.log('testItem: ', testItem, 'type of testItem: ', typeof testItem);

// return (
//   <div className={classes.item} onResize={() => resizeAllGridItems()} id={post._id} style={{ gridRowEnd: `span ${gridRowSpan}` }}>
//     <Card withBorder p="lg" radius="md" className={classes.card} id="card" ref={content}></Card>
//   </div>
// )

// style= {
//   gridRowEnd: `span ${gridRowSpan}`
// };

useEffect(() => {
  // dynamically enable filtering
    axios.get('/posts')
    .then((response) => setPosts(response.data))
    .catch((err) => console.log('error getting posts', err))
  }, []);

  const gridItems =  posts.map(post => (
    // <div
    // onResize={() => resizePost()}
    // grid={grid} rowGap={rowGap} rowHeight={rowHeight}
    // style={{ gridRowEnd: `span ${gridRowSpan}` }}
    // key={post.id}
    //  >
      <Post
      // content={ref}
      post={post}
      grid={grid} rowGap={rowGap} rowHeight={rowHeight}
      key={post.id}
      />
    // </div>
  ));

  return (
    <Container ref={grid}  style={{ display: 'grid', gridGap: '16px', gridAutoRows: '25px'}}
    // onResize={() => resizeAllGridItems()}
    >
      {/* <div */}
      {/* // grid={grid} rowGap={rowGap} rowHeight={rowHeight}
    //  onResize={() => resizeAllGridItems()}
    //  style={{ gridRowEnd: `span ${gridRowSpan}` }}/> */}
       {/* {nothingFound && <Text>Sorry, no posts match your search</Text>}
          {posts.map((post, i) => (
          <Post
          key={post._id} post={post} index={i} posts={posts} setPosts={setPosts} user={user} isLoggedIn={isLoggedIn}  handleFilterPosts={handleFilterPosts}></Post>
        ))} */}
        {gridItems}
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