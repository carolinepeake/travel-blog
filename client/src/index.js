import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';

import App from './components/App.js';

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
        brown: ['#feefe1', '#f1d7bf', '#e5c19a', '#d9ac73', '#cd8c4c', '#b46a32', '#8c4c26', '#64301a', '#3d180c', '#190300'],
        green: ['#f1f8e5', '#dbe9c7', '#c5d8a6', '#adc883', '#96b961', '#7d9f47', '#617c37', '#455826', '#293514', '#0b1300'],
        terracotta: ['#ffe9e4', '#f8c6bc', '#eda292', '#e47d67', '#dc583d', '#c23f23', '#98301b', '#6d2112', '#431308', '#1d0300']
      },
      primaryColor: 'green'
    }}
   >
    <App name="Travel Blog"/>
  </MantineProvider>
);

// Update
// root.render(<App name="Travel Agent" />);
