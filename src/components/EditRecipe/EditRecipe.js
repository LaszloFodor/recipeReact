import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import IngredientAdder from './IngredientAdder';
import fetch from 'isomorphic-fetch';

import './EditRecipe.css';

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
    enableAddIngredient: false,
    selectedDifficulty: null
  };

  difficulty = [
    { display: 'Easy', value: 'EASY' },
    { display: 'Medium', value: 'MEDIUM' },
    { display: 'Hard', value: 'HARD' }
  ];

  componentDidMount() {
    if (this.props.recipeId === null) {
      fetch(`/api/recipe/categories`, {
        credentials: 'same-origin',
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
          this.setState({
            recipe: {
              ingredients: [],
              nutritions: []
            },
            categories: categories || []
          });
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

  onSaveNewIngredient = (event, { amount, name, selectedUnit }) => {
    const newIngredient = { id: null, recipeId: this.state.recipe.id, name, amount: +amount, uom: selectedUnit };
    const { recipe, enableAddIngredient } = this.state;

    this.setState({
      recipe: {
        ...recipe,
        ingredients: [...recipe.ingredients, newIngredient]
      },
      enableAddIngredient: false
    });

    /* this.setState(
      currentState => {
        return {
          ...currentState.recipe,
          ingredients: [...currentState.recipe.ingredients, newIngredient],
          enableAddIngredient: false
        };
      },
      () => console.log(this.state)
    ); */
  };
  onSelectChange = event => {
    this.setState({ selectedDifficulty: event.target.value });
  };

  onSubmitForm = event => {
    const { recipe } = this.state;
    event.preventDefault();

    const headers = {
      Accept: '*/*',
      'Content-Type': 'application/json; charset=utf-8'
    };
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
    debugger;
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

  onClickDelete = (event, ingredient) => {
    const newIngredients = Object.assign([], this.state.recipe.ingredients);
    const itemToDeleteIndx = newIngredients.findIndex(item => item.name === ingredient.name);
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

  onClickDeleteCategory = (event, category) => {
    debugger;
    const newCategories = Object.assign([], this.state.recipe.categories);
    const itemToDeleteIndx = newCategories.findIndex(item => item.name === category.name);
    if (itemToDeleteIndx < 0) return;

    newCategories.splice(itemToDeleteIndx, 1);
    this.setState(currentState => {
      return {
        recipe: {
          ...currentState.recipe,
          categories: newCategories
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

    this.setState({
      recipe: {
        ...recipe,
        categories: [
          ...(recipe.categories || {}),
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
      <form className="edit-recipe container" onSubmit={this.onSubmitForm}>
        <div className="recipe columns">
          <label htmlFor="name" className="column is-2">
            Recipe name:
          </label>
          <input
            className="input column is-10"
            type="text"
            id="name"
            value={recipe.name}
            onChange={this.onInputChange}
          />
        </div>
        <div className="serving columns ">
          <label className="column is-2" htmlFor="serving">
            Servings:
          </label>
          <input
            className="input column is-10"
            type="text"
            id="servings"
            value={recipe.servings}
            onChange={this.onInputChange}
          />
        </div>
        <div className="cookTime columns">
          <label className="column is-2" htmlFor="cookTime">
            Cook Time:
          </label>
          <input
            className="input column is-10"
            type="text"
            id="cookTime"
            value={recipe.cookTime}
            onChange={this.onInputChange}
          />
        </div>
        <div className="source columns">
          <label className="column is-2" htmlFor="source">
            Source:
          </label>
          <input
            className="input column is-10"
            type="text"
            id="source"
            value={recipe.source}
            onChange={this.onInputChange}
          />
        </div>
        <ul className="ingredients">
          <div className="ingredients-wrapper title">
            <label htmlFor="ingredients">Ingredients:</label>
            <button
              disabled={this.state.enableAddIngredient}
              type="button"
              name="ingredientsCount"
              onClick={this.onAddNewIngredient}
            >
              + Add Ingredients
            </button>
          </div>
          {(ingredients || []).map(ingredient => (
            <li key={ingredient.id} className="columns">
              <input
                type="text"
                id="ingredients.amount"
                data-id={ingredient.id}
                value={ingredient.amount}
                onChange={this.onInputChange}
                className="input column is-4"
              />
              <input
                type="text"
                id="ingredients.uom"
                data-id={ingredient.id}
                value={ingredient.uom}
                onChange={this.onInputChange}
                className="input column is-4"
              />
              <input
                type="text"
                id="ingredients.name"
                data-id={ingredient.id}
                value={ingredient.name}
                onChange={this.onInputChange}
                className="input column is-4"
              />
              {this.state.recipe.ingredients.length > 1 ? (
                <button data-id={ingredient.id} type="button" onClick={event => this.onClickDelete(event, ingredient)}>
                  -
                </button>
              ) : null}
            </li>
          ))}
          {this.state.enableAddIngredient ? (
            <IngredientAdder>
              {props => {
                return (
                  <div>
                    <input
                      onChange={props.onInputChange}
                      name="amount"
                      type="text"
                      id="ingredients.amount"
                      placeholder="Please add the amount"
                      className="input"
                    />
                    <select
                      className="input"
                      onChange={props.onSelect}
                      name="unit"
                      defaultValue="default"
                      value={props.selectedUnit}
                    >
                      <option value="default" disabled>
                        Please select unit
                      </option>
                      {props.uom
                        ? props.uom.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))
                        : null}
                    </select>
                    <input
                      onChange={props.onInputChange}
                      type="text"
                      id="ingredients.name"
                      name="name"
                      placeholder="Please add ingerdient"
                      className="input"
                    />
                    <button onClick={event => this.onSaveNewIngredient(event, props)}>Save</button>
                    <button
                      onClick={() =>
                        this.setState(({ enableAddIngredient }) => ({ enableAddIngredient: !enableAddIngredient }))
                      }
                    >
                      Cancel
                    </button>
                  </div>
                );
              }}
            </IngredientAdder>
          ) : null}
        </ul>

        <ul className="nutritions">
          <div className="title">
            <label htmlFor="nutritionsCount">Nutritions:</label>
          </div>
          {(nutritions || []).map((nutrition, idx) => (
            <li key={idx} className="columns">
              <input
                type="text"
                id="nutritions.amount"
                data-id={nutrition.id}
                value={nutrition.amount}
                onChange={this.onInputChange}
                className="input column is-6"
              />
              <input
                type="text"
                id="nutritions.ton"
                data-id={nutrition.id}
                value={nutrition.ton}
                onChange={this.onInputChange}
                className="input column is-6"
              />
            </li>
          ))}
        </ul>

        <ul className="categories ">
          <div className="title">
            <label htmlFor="categories">Categories:</label>
          </div>
          <div className="columns">
            <select className="input column is-8" onChange={this.onCategorySelect} name="category">
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
            <button
              className="column is-4"
              disabled={!this.state.selectedCategory}
              type="button"
              onClick={this.onAddCategoryClick}
            >
              Add Category
            </button>
          </div>
          {(categories || []).map(category => (
            <li key={category.id} className="columns">
              <input
                type="text"
                id="categories.name"
                data-id={category.id}
                value={category.name}
                onChange={this.onInputChange}
                className="input "
              />
              {this.state.recipe.categories.length > 1 ? (
                <button className="" type="button" onClick={event => this.onClickDeleteCategory(event, category)}>
                  -
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        <ul className="difficulty">
          <div className="title">
            <label htmlFor="difficulty">Difficulty:</label>
          </div>
          <select
            defaultValue="default"
            value={this.state.selectedDifficulty}
            name="difficulty"
            id="difficulty"
            onChange={this.onSelectChange}
            className="input"
          >
            <option disabled value="default">
              Please select difficulty
            </option>
            {this.difficulty.map((diff, idx) => {
              return <option value={diff.value}>{diff.display}</option>;
            })}
          </select>
        </ul>
        <div className="actions">
          <button type="submit">{this.props.recipeId === null ? 'Add' : 'Edit'}</button>
          <button type="button" onClick={this.onBackClick}>
            Close
          </button>
        </div>
      </form>
    );
  }
}

export default withRouter(EditRecipe);
