import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import LoginDialog from './LoginDialog';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <LoginDialog history={history} />
    </MemoryRouter>
  );
  expect(wrapper.find('.login-dialog')).toHaveLength(1);
});
