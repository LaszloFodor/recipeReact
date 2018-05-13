import React from 'react';
import ReactDOM from 'react-dom';
import NewRecipe from './NewRecipe';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom'

it('NewRecipe renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <NewRecipe />
    </MemoryRouter>
  );
  expect(wrapper.html()).toEqual('<div>ahoy!</div>');
  wrapper.unmount();
});
