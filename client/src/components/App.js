import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { ScrollArea, Aside, createStyles, Text } from '@mantine/core';
import { getUser } from '../state/usersSlice.js';
import NavBar from './NavBar.js';
import Banner from './Banner.js';
import LeftSidebar from './LeftSidebar.js';
import Feed from './Feed.js';
// import MasonaryLayout from './MasonaryLayout.js';
// import LgCalendar from './LgCalendar.js';

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


  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("user");
  //   if (typeof loggedInUser === 'string' || typeof loggedInUser === 'object') {
  //     const parsedUser = JSON.parse(loggedInUser);
  //   } else {
  //     return;
  //   }
  //   parsedUser.hasOwnProperty('_id') ? dispatch(getUser(parsedUser._id)) : dispatch(getUser(parsedUser));
  // }, []);

    // could lazy init the photos

  //const viewport = useRef<HTMLDivElement/>(null));

  // const scrollToBottom = () =>
  //   viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

  // //viewportRef={viewport} in returned DOm element (LG calendar) or maybe scrollArea?

  return (
    <div>
      <NavBar />
      <div style={{ height: 1400 }} className={classes.main}>
        <LeftSidebar />
        <Aside>
          <Banner />
          {/* <MasonaryLayout /> */}
          <Feed />
          {/* <LgCalendar /> */}
        </Aside>
      </div>
    </div>
  );
};
