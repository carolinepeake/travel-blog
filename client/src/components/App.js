import React from "react";
import { ScrollArea, Aside, createStyles, Text } from '@mantine/core';
import NavBar from './NavBar.js';
import Banner from './Banner.js';
import UserSidebar from './UserSidebar.js';
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

    // could lazy init the photos

  //const viewport = useRef<HTMLDivElement/>(null));

  // const scrollToBottom = () =>
  //   viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

  // //viewportRef={viewport} in returned DOm element (LG calendar) or maybe scrollArea?

  return (
    <div>
      <NavBar />
      <div style={{ height: 1400 }} className={classes.main}>
        <UserSidebar />
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
