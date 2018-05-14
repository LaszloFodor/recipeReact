import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(wrapper.find(".app")).toHaveLength(1);
});
