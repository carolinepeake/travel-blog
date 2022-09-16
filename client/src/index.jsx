import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';

import App from './components/App.jsx';

const container = document.getElementById('root');

// Create root
const root = createRoot(container);

// Initial render
root.render(
  <MantineProvider
    withGlobalStyles
    with NormalizeCSS
    theme={{
      colors: {
        cyan: ['#E3FAFC', '#C5F6FA', '#99E9F2', '#66D9E8', '#3BC9DB', '#22B8CF', '#15AABF', '#1098AD', '#0C8599', '#0B7285'],
        teal: ['#E6FCF5', '#C3FAE8', '#96F2D7', '#63E6BE', '#38D9A9', '#20C997', '#12B886', '#0CA678', '#099268', '#087F5B']
      },
      primaryColor: 'cyan'
    }}
   >
    <App name="Travel Blog"/>
  </MantineProvider>
);

// Update
// root.render(<App name="Travel Agent" />);
