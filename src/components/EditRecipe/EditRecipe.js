import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import IngredientAdder from './IngredientAdder';
import fetch from 'isomorphic-fetch';

class EditRecipe extends Component {
  static propTypes = {
    recipeId: PropTypes.number,
    onError: PropTypes.func,
    history: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    onError: null,
    recipeId: null
  };

  state = {
    recipe: null,
    selectedCategory: null,
    categories: [],
    enableAddIngredient: false
  };

  componentDidMount() {
    if (this.props.recipeId === null) {
      this.setState({
        recipe: {
          ingredients: [{ id: -Date.now(), name: '', amount: '' }],
          nutritions: [{ id: -Date.now(), amount: '', ton: '' }],
          categories: [{ id: -Date.now(), name: '' }]
        }
      });
      return;
    }

    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    fetch(`/api/recipe/${this.props.recipeId}`, {
      credentials: 'same-origin',
      method: 'GET',
      headers
    })
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Error in server response!');
        }
        return response.json();
      })
      .catch(error => {
        if (this.props.onError) {
          this.props.onError(error);
        }
        // no data or error happened
      })
      .then(recipe => {
        fetch(`/api/recipe/categories`, {
          credentials: 'same-origin',
          headers,
          method: 'GET'
        })
          .then(response => {
            if (response.status < 200 || response.status >= 300) {
              throw new Error('Error in server response!');
            }
            return response.json();
          })
          .catch(error => {
            if (this.props.onError) {
              this.props.onError(error);
            }
            // no data or error happened
          })
          .then(categories => {
            this.setState({ recipe: recipe || null, categories: categories || [] });
          });
      });
  }

  onCategorySelect = event => this.setState({ selectedCategory: event.target.value });

  onSubmitForm = event => {
    const { recipe } = this.state;
    event.preventDefault();

    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    const data = { ...recipe };
    data.categories = data.categories.map(category => (category.id < 0 ? { id: null, name: category.name } : category));

    fetch(`/api/recipe/${recipe.id}`, {
      credentials: 'same-origin',
      method: 'PUT',
      body: JSON.stringify(data),
      headers
    })
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Error in server response!');
        }
        return response.json();
      })
      .catch(error => {
        if (this.props.onError) {
          this.props.onError(error);
        }
        // no data or error happened
      })
      .then(recipe => {
        this.setState({ recipe: recipe || null });
      });
  };

  onInputChange = event => {
    // update the field value in state
    const { recipe } = this.state;
    const { id, value } = event.currentTarget;

    const idParts = id.split('.');
    const dataId = +event.currentTarget.getAttribute('data-id');
    // in case id has no dot in the id we simply apply the change
    if (idParts.length === 1) {
      // in case dataId is defined recipe[id] is an array, we need to update array item with a specific id
      if (dataId) {
        const items = [...recipe[id]];
        const itemIdx = items.findIndex(item => item.id === dataId);
        items[itemIdx] = value;
        this.setState({ recipe: { ...recipe, [id]: items } });
      } else {
        this.setState({ recipe: { ...recipe, [id]: value } });
      }
      return;
    }

    // in case of dot we check for dataId and update the item regarding to its value
    const subItems = recipe[idParts[0]];
    if (dataId) {
      console.log(subItems);
      const items = [...subItems];
      const itemIdx = items.findIndex(item => item.id === dataId);
      items[itemIdx][idParts[1]] = value;
      this.setState({ recipe: { ...recipe, [idParts[0]]: items } });
    } else {
      const props = { ...subItems, [idParts[1]]: value };
      this.setState({ recipe: { ...recipe, [idParts[0]]: props } });
    }
  };

  onBackClick = () => this.props.history.goBack();

  onClickDelete = event => {
    const dataId = +event.currentTarget.getAttribute('data-id');
    const newIngredients = Object.assign([], this.state.recipe.ingredients);
    const itemToDeleteIndx = newIngredients.findIndex(ingredient => ingredient.id === dataId);
    if (itemToDeleteIndx < 0) return;

    newIngredients.splice(itemToDeleteIndx, 1);
    this.setState(currentState => {
      return {
        recipe: {
          ...currentState.recipe,
          ingredients: newIngredients
        }
      };
    });
  };

  onAddItem = event => {
    this.setState(currentState => {
      console.log(event);

      /*  return {
        [event.target.name]: currentState[event.target.name] + 1
      }; */
    });
  };

  onAddNewIngredient = () => {
    this.setState({ enableAddIngredient: true });
  };

  onAddCategoryClick = () => {
    const { recipe, selectedCategory } = this.state;
    const selectedCategoryIndex = this.state.categories.findIndex(category => category.name === selectedCategory);
    if (selectedCategoryIndex < 0) return;
    const newCategories = Object.assign([], this.state.categories);
    newCategories.splice(selectedCategoryIndex, 1);

    console.log(selectedCategoryIndex);

    this.setState({
      recipe: {
        ...recipe,
        categories: [
          ...recipe.categories,
          {
            id: -Date.now(),
            name: selectedCategory
          }
        ]
      },

      categories: newCategories
    });
  };

  render() {
    const { recipe } = this.state;
    const { ingredients, nutritions, categories } = recipe || {};

    if (!recipe) {
      return <div className="edit-recipe">Loading or no recipe found...</div>;
    }

    return (
      <form className="edit-recipe" onSubmit={this.onSubmitForm}>
        <div className="recipe">
          <div className="name">
            <label htmlFor="name">Recipe name:</label>
            <input type="text" id="name" value={recipe.name} onChange={this.onInputChange} />
          </div>
          <div className="serving">
            <label htmlFor="serving">Servings:</label>
            <input type="text" id="servings" value={recipe.servings} onChange={this.onInputChange} />
          </div>
          <div className="cookTime">
            <label htmlFor="cookTime">Cook Time:</label>
            <input type="text" id="cookTime" value={recipe.cookTime} onChange={this.onInputChange} />
          </div>
          <div className="source">
            <label htmlFor="source">Source:</label>
            <input type="text" id="source" value={recipe.source} onChange={this.onInputChange} />
          </div>
          <ul className="ingredients">
            <label htmlFor="ingredients">Ingredients:</label>
            <button type="button" name="ingredientsCount" onClick={this.onAddNewIngredient}>
              + Add Ingredients
            </button>
            {(ingredients || []).map(ingredient => (
              <li key={ingredient.id}>
                <input
                  type="text"
                  id="ingredients.amount"
                  data-id={ingredient.amount}
                  value={ingredient.amount}
                  onChange={this.onInputChange}
                />
                <input
                  type="text"
                  id="ingredients.uom"
                  data-id={ingredient.uom}
                  value={ingredient.uom}
                  onChange={this.onInputChange}
                />
                <input
                  type="text"
                  id="ingredients.name"
                  data-id={ingredient.id}
                  value={ingredient.name}
                  onChange={this.onInputChange}
                />
                {this.state.recipe.ingredients.length > 1 ? (
                  <button data-id={ingredient.id} type="button" onClick={this.onClickDelete}>
                    -
                  </button>
                ) : null}
              </li>
            ))}
            {this.state.enableAddIngredient ? <IngredientAdder /> : null}
          </ul>

          <ul className="nutritions">
            <label htmlFor="nutritionsCount">Nutritions:</label>
            <button type="button" onClick={event => this.onAddItem(event)}>
              + Add Nutrition
            </button>
            {(nutritions || []).map((nutrition, idx) => (
              <li key={nutrition.id}>
                <input
                  type="text"
                  id="nutritions.amount"
                  data-id={nutrition.amount}
                  value={nutrition.amount}
                  onChange={this.onInputChange}
                />
                <input
                  type="text"
                  id="nutritions.ton"
                  data-id={nutrition.ton}
                  value={nutrition.ton}
                  onChange={this.onInputChange}
                />
                {this.state.recipe.nutritions.length > 1 ? (
                  <button type="button" onClick={this.onClickDelete}>
                    -
                  </button>
                ) : null}
              </li>
            ))}
          </ul>

          <ul className="categories">
            <label htmlFor="categories">Categories:</label>
            <select onChange={this.onCategorySelect} name="category">
              <option disabled selected>
                Please select a category
              </option>
              {this.state.categories.map((category, index) => {
                return (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                );
              })}
            </select>
            <button disabled={!this.state.selectedCategory} type="button" onClick={this.onAddCategoryClick}>
              Add Category
            </button>
            {(categories || []).map(category => (
              <li key={category.id}>
                <input
                  type="text"
                  id="categories.name"
                  data-id={category.id}
                  value={category.name}
                  onChange={this.onInputChange}
                />
              </li>
            ))}
          </ul>

          <ul className="difficulty">
            <label htmlFor="difficulty">Difficulty:</label>
            <input type="text" id="difficulty" value={recipe.difficulty} onChange={this.onInputChange} />
          </ul>
        </div>
        <div className="actions">
          <button type="submit">Edit</button>
          <button type="button" onClick={this.onBackClick}>
            Close
          </button>
        </div>
      </form>
    );
  }
}

export default withRouter(EditRecipe);
