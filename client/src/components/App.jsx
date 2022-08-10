import React from "react";
import NavBar from './routes/NavBar.jsx';
import UserNav from './UserNav.jsx';
import Banner from './Banner.jsx';
import Feed from './Feed.jsx';




function App() {

  // prolly don't need to link to a different page with the NavBar, but just change the state
  // and update the posts rendered based on state.tagSelected - doesn't make sense to use pathnames for selections of music or kiteboard, would be better in query part of url maybe or nested pathnames, esp if the tags change, doesn;t make sense to haev them as paths in url

  const links = [{link: '/bucketlist', label: 'bucket list'}, {link: '/kiteboarding', label: 'kiteboarding'}, {link: '/scuba', label: 'scuba'}, {link: '/music', label: 'music'}, {link: '/gastronomy', label: 'gastronomy'}];

  return (
    <div>
      <NavBar links={links}/>
      <UserNav />
      <Banner />
      <Feed />
    </div>
  )
}

export default App;