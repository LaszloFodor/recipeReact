import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import ViewRecipe from './ViewRecipe';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

it('Viewrecipe renders with mock data', () => {
  const history = createMemoryHistory('/view-recipe/1');
  const wrapper = mount(
    <MemoryRouter>
      <ViewRecipe recipeId={1} history={history} />
    </MemoryRouter>
  );
  if (!wrapper.state.recipe) {
    expect(wrapper.find('.loading')).toHaveLength(1);
  } else {
    expect(wrapper.find('.view-recipe')).toHaveLength(1);
  }
});
