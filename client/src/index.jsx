import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App.jsx';

const container = document.getElementById('root');

// Create root
const root = createRoot(container);

// Initial render
root.render(<App name="Travel Blog" />);

// Update
// root.render(<App name="Travel Agent" />);
