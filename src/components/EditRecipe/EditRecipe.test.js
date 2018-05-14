import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import EditRecipe from './EditRecipe';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <EditRecipe history={history} />
    </MemoryRouter>
  );
  expect(wrapper.find('.edit-recipe')).toHaveLength(1);
});
