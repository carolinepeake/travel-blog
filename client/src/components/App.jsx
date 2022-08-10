import React from "react";
import { MantineProvider } from '@mantine/core';



function App() {

  // prolly don't need to link to a different page with the NavBar, but just change the state
  // and update the posts rendered based on state.tagSelected

  const links = [{link: '', label: 'home'} {link:'' label: 'bucket list'}, {link: '', label:'kiteboarding'}, {link:, label: 'scuba'}, {link: '', label: 'music'}, {link: , label: 'gastronomy'}];

  return (
    <MantineProvider>
      <div>Hello World!</div>
      <NavBar links={links}/>
      <UserSidebar />
      <TitleBanner />
      <Posts />
    </MantineProvider>
  )
}

export default App;