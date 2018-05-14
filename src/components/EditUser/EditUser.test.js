import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import EditUser from './EditUser';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <EditUser history={history} />
    </MemoryRouter>
  );
  expect(wrapper.find('.edit-user')).toHaveLength(1);
});
