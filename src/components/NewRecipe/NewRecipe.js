import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

class NewRecipe extends Component {

  onSubmitForm = () => {

  }

  onInputChange = () => {

  };

  render() {
    return (
      <form className="edit-recipe" onSubmit={this.onSubmitForm}>
        <div className="recipe">
          <div className="name">
            <label htmlFor="name">Recipe name:</label>
            <input type="text" id="name" onChange={this.onInputChange} />
          </div>
          <div className="serving">
            <label htmlFor="serving">Servings:</label>
            <input type="text" id="servings" onChange={this.onInputChange} />
          </div>
          <div className="cookTime">
            <label htmlFor="cookTime">Cook Time:</label>
            <input type="text" id="cookTime" onChange={this.onInputChange} />
          </div>
          <div className="source">
            <label htmlFor="source">Source:</label>
            <input type="text" id="source" onChange={this.onInputChange} />
          </div>
          <ul className="ingredients">
            <label htmlFor="ingredients">Ingredients:</label>
            {(this.props.ingredients || []).map(ingredient =>
              <li key={ingredient.id}>
                <input type="text" id="ingredients.amount" data-id={ingredient.amount} onChange={this.onInputChange} />
                <input type="text" id="ingredients.name" data-id={ingredient.id} onChange={this.onInputChange} />
              </li>
            )}
          </ul>

          <ul className="nutritions">
            <label htmlFor="nutritions">Nutritions:</label>
            {(this.props.nutritions || []).map(nutrition =>
              <li key={nutrition.id}>
                <input type="text" id="nutritions.amount" data-id={nutrition.amount} onChange={this.onInputChange} />
                <input type="text" id="nutritions.uom" data-id={nutrition.ton} onChange={this.onInputChange} />
              </li>
            )}
          </ul>

          <ul className="categories">
            <label htmlFor="categories">Categories:</label>
            
            <li key={category.id}>
              <input type="text" id="categories.name" data-id={category.id} onChange={this.onInputChange} />
            </li>

          </ul>

          <ul className="difficulty">
            <label htmlFor="difficulty">Difficulty:</label>
            <input type="text" id="difficulty" onChange={this.onInputChange} />
          </ul>

        </div>
        <div className="actions">
          <button type="submit">Edit</button>
          <button type="button" onClick={this.onBackClick}>Close</button>
        </div>
      </form>
    );
  }

}

export default withRouter(NewRecipe);