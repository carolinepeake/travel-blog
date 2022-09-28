import {
  React,
  useRef,
  useState
} from "react";
import { ScrollArea, Aside, createStyles } from '@mantine/core';
import NavBar from './NavBar.js';
import Banner from './Banner.js';
import UserSidebar from './UserSidebar.js';
// import CreateAccountSidebar from './CreateAccountSidebar.jsx';
import Feed from './Feed.js';
import LgCalendar from './LgCalendar.js';

const useStyles = createStyles((theme) => ({
  main: {
    display: 'flex',
    marginLeft: 'auto',
    //maxWidth: '960px',
    overflow: 'auto',
    position: 'relative',
  }
}))

export default function App() {
  const { classes } = useStyles();
  const [user, setUser] = useState({});
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);

  // prolly don't need to link to a different page with the NavBar, but just change the state
  // and update the posts rendered based on state.tagSelected - doesn't make sense to use pathnames for selections of music or kiteboard, would be better in query part of url maybe or nested pathnames, esp if the tags change, doesn;t make sense to haev them as paths in url

  //const viewport = useRef<HTMLDivElement/>(null));

  // const scrollToBottom = () =>
  //   viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });


  const links = [{link: '/home', label: 'home'}, {link: '/bucketlist', label: 'bucket list'}, {link: '/kiteboarding', label: 'kiteboarding'}, {link: '/scuba', label: 'scuba'}, {link: '/music', label: 'music'}, {link: '/gastronomy', label: 'gastronomy'}];


  // //viewportRef={viewport} in returned DOm element (LG calendar) or maybe scrollArea?

  return (
    <div>
      <NavBar links={links}/>
      <div style={{ height: 1400 }} className={classes.main}>
      {/* {isLoggedIn */}
      {/* ?  */}
      <UserSidebar user={user} setUser={setUser} posts={posts} setPosts={setPosts}/>
      {/* : <CreateAccountSidebar />} */}
      <Aside>
        <Banner />
        <Feed posts={posts} setPosts={setPosts} user={user}/>
        <LgCalendar />
      </Aside>

      </div>
    </div>
  )
}
