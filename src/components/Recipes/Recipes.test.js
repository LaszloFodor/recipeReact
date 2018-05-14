import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Recipes from './Recipes';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <Recipes history={history} mode="all" />
    </MemoryRouter>
  );
  expect(wrapper.find('.recipes')).toHaveLength(1);
});
