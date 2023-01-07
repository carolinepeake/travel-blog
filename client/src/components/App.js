import React, {
  useState,
} from "react";
import { useDispatch } from 'react-redux';
import { ScrollArea, Aside, createStyles, Text } from '@mantine/core';
import NavBar from './NavBar.js';
import Banner from './Banner.js';
import UserSidebar from './UserSidebar.js';
import Feed from './Feed.js';
// import MasonaryLayout from './MasonaryLayout.js';
// import LgCalendar from './LgCalendar.js';
import {
  fetchPosts
} from '../state/postsReducer.js';

const useStyles = createStyles((theme) => ({
  main: {
    display: 'flex',
    marginLeft: 'auto',
    //maxWidth: '960px',
    overflow: 'auto',
    position: 'relative',
    zIndex: 1,
  }
}));

export default function App() {
  const { classes } = useStyles();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

    // could lazy init the photos


  //const viewport = useRef<HTMLDivElement/>(null));

  // const scrollToBottom = () =>
  //   viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

  const handleFilterPosts = async (route, filterTerm, e) => {
    e && e.preventDefault();
    dispatch(fetchPosts({[route]: filterTerm}));
  };

  // //viewportRef={viewport} in returned DOm element (LG calendar) or maybe scrollArea?

  return (
    <div>
      <NavBar user={user} isLoggedIn={isLoggedIn} />
      <div style={{ height: 1400 }} className={classes.main}>
        <UserSidebar user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Aside>
        {/* <div style={{display: 'flex', flexDirection: 'column'}}> */}
          <Banner />
          {/* <MasonaryLayout posts={posts} setPosts={setPosts} user={user} isLoggedIn={isLoggedIn}/> */}
          <Feed
          user={user} isLoggedIn={isLoggedIn}
          />
          {/* <LgCalendar /> */}
        </Aside>
        {/* </div> */}
      </div>
    </div>
  );
};
