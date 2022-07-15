import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import App  from './App.js';

export default {
  title: 'V1/App',
  component: App,
  decorators: [(Story) => (<MemoryRouter><Story/></MemoryRouter>)],
};

export const Default = () =>
  <App/>