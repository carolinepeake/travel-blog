import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from '@mantine/core';

import App from './components/App.jsx';
import NavBar from './components/routes/NavBar.jsx';
import Bucketlist from './components/routes/bucketlist.jsx';
import Kiteboarding from './components/routes/kiteboarding.jsx';
import Scuba from './components/routes/scuba.jsx';
import Music from './components/routes/music.jsx';
import Gastronomy from './components/routes/gastronomy.jsx';

const container = document.getElementById('root');

// Create root
const root = createRoot(container);

// Initial render
root.render(
  <div>
    <MantineProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App name="Travel Blog"/>} >
        <Route index element={<NavBar />} />
        <Route path="bucketlist" element={<Bucketlist name="bucket list" />} />
        <Route path="kiteboarding" element={<Kiteboarding name="kiteboarding" />} />
        <Route path="scuba" element={<Scuba name="scuba" />} />
        <Route path="music" element={<Music name="music" />} />
        <Route path="gastronomy" element={<Gastronomy name="gastronomy" />} />
      </Route>
    </Routes>
    </BrowserRouter>
    </MantineProvider>
  </div>
);

// Update
// root.render(<App name="Travel Agent" />);
