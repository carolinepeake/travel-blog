import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';

import App from './components/App.jsx';

const container = document.getElementById('root');

// Create root
const root = createRoot(container);

// Initial render
root.render(
  <MantineProvider>
    <App name="Travel Blog"/>
  </MantineProvider>
);

// Update
// root.render(<App name="Travel Agent" />);
