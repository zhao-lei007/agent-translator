#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import {App} from './components/App.js';

const app = render(<App />);

// Handle graceful exit
process.on('SIGINT', () => {
  app.unmount();
  process.exit(0);
});