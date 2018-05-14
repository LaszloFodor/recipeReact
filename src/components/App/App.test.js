import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(wrapper.find('.app')).toHaveLength(1);
});

it('renders after login', () => {
  let json = require("../../__mocks__/login.json");
  const wrapper = shallow(
        <App.WrappedComponent history={history} />
  );
  wrapper.instance().onLoggedIn(json.user, json.accesstoken);
  expect(wrapper.find('.logged-user')).toHaveLength(1);
});
