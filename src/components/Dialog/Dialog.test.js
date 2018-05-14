import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Dialog from './Dialog';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <Dialog title="title" message="message" />
    </MemoryRouter>
  );
  expect(wrapper.find('.mask')).toHaveLength(1);
});