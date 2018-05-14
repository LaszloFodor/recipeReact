import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import DeleteRecipe from './DeleteRecipe';
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <DeleteRecipe recipeId={0} />
    </MemoryRouter>
  );
  expect(wrapper.find('Dialog[title="Confirmation"]')).toHaveLength(1);
});
