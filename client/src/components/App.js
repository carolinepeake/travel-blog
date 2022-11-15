import {
  useState,
  useEffect
} from "react";
import { ScrollArea, Aside, createStyles } from '@mantine/core';
import NavBar from './NavBar.js';
import Banner from './Banner.js';
import UserSidebar from './UserSidebar.js';
import Feed from './Feed.js';
// import LgCalendar from './LgCalendar.js';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
  main: {
    display: 'flex',
    marginLeft: 'auto',
    //maxWidth: '960px',
    overflow: 'auto',
    position: 'relative',
  }
}));

export default function App() {
  const { classes } = useStyles();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);

  // prolly don't need to link to a different page with the NavBar, but just change the state
  // and update the posts rendered based on state.tagSelected - doesn't make sense to use pathnames for selections of music or kiteboard, would be better in query part of url maybe or nested pathnames, esp if the tags change, doesn;t make sense to haev them as paths in url

    // could lazy init the photos

  useEffect(() => {
    // dynamically enable filtering
      axios.get('/posts')
      .then((response) => setPosts(response.data))
      .catch((err) => console.log('error getting posts', err))
    }, []);


  //const viewport = useRef<HTMLDivElement/>(null));

  // const scrollToBottom = () =>
  //   viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

  const handleFilterPosts = async (route, filterTerm, e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3001/posts/filter/${route}/${filterTerm}`);
      let filteredPosts = response.data;
      console.log('response from handleFilterPosts in App component', response.data);
      setPosts(filteredPosts);
    } catch (err) {
      console.log('error filtering posts', err);
    }
  };

  const links = [{link: '/kiteboarding', label: 'kiteboarding'}, {link: '/scuba', label: 'scuba'}, {link: '/music', label: 'music'}, {link: '/gastronomy', label: 'gastronomy'}];

  const bucketList = {link: '/bucketlist', label: 'bucketlist'};

  const home = {link: '/home', label: 'home'};

  const regions = [{link: '/africa', label: 'Africa'}, {link: '/australia', label: 'Australia'}, {link: '/centralamerica', label: 'Central America'}, {link: '/centralasia', label: 'Central Asia'}, {link: '/eastasia', label: 'East Asia'}, {link: '/europe', label: 'Europe'}, {link: '/northafrica', label: 'North Africa'}, {link: '/northamerica', label: 'North America'}, {link: '/southamerica', label: 'South America'}, {link: '/southeastasia', label: 'Southeast Asia'}, {link: '/newzealand', label: 'New Zealand'}, {link: '/middleeast', label: 'Middle East'}];


  // //viewportRef={viewport} in returned DOm element (LG calendar) or maybe scrollArea?

  return (
    <div>
      <NavBar handleFilterPosts={handleFilterPosts} links={links} user={user} setPosts={setPosts} regions={regions} isLoggedIn={isLoggedIn} home={home} bucketList={bucketList}/>
      <div style={{ height: 1400 }} className={classes.main}>
        <UserSidebar user={user} setUser={setUser} posts={posts} setPosts={setPosts} regions={regions} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Aside>
          <Banner />
          <Feed posts={posts} setPosts={setPosts} user={user} isLoggedIn={isLoggedIn}  handleFilterPosts={handleFilterPosts}/>
          {/* <LgCalendar /> */}
        </Aside>
      </div>
    </div>
  );
};

// global context or redux store:
// user: {},
// isLoggedIn: boolean,
// links: [Obj],
// + home and bucketlist?

// posts
// view (filterValue) -- if view term is on NavBar, highlight it (so only need one state for this)


// local state:

  // NavBar
    // active
    // search value


// isLoggedIN

// link can be get
