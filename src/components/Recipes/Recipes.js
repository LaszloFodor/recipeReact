import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import { DeleteRecipe } from 'components';

import './Recipes.css';

class Recipes extends Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    onError: PropTypes.func,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    onError: null,
  };

  static modes = {
    my: {
      title: 'My Recipes',
      url: '/api/recipes/my',
      actions: {
        view: true,
        edit: true,
        delete: true,
      },
    },
    all: {
      title: 'All Recipes',
      url: '/api/recipes/all',
      actions: {
        view: true,
      },
    },
  };

  constructor() {
    super();

    this.state = {
      recipes: [],
      deleteRecipeId: null
    };
  }

  componentWillMount() {
    const mode = Recipes.modes[this.props.mode];

    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    fetch(mode.url, {
      credentials: 'same-origin', // include, same-origin, *omit
      method: 'GET', // use POST, PUT or DELETE here
//      body: JSON.stringify(bodyObjectOrArrey),
      headers,     
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Error in server response!');
        }
        return response.json();
      })
      .catch((error) => {
        if (this.props.onError) {
          this.props.onError(error);
        }
        // no data or error happened
      })
      .then((recipes) => {
        this.setState({ recipes: recipes || [] });
      });
  }

  onViewRecipeClick = (event) => {
    // route to view recipe
    const recipeId = +event.currentTarget.getAttribute(['data-recipe-id']); // "+" converts str to int in js (or you can use 'parseInt(str, 10)' as well)
    this.props.history.push(`/view-recipe/${recipeId}`);
  };

  onEditRecipeClick = (event) => {
    // TODO: route to edit recipe
    const recipeId = +event.currentTarget.getAttribute(['data-recipe-id']);
    this.props.history.push(`/edit-recipe/${recipeId}`);
  };

  onDeleteRecipeClick = (event) => {
    // show confirmation dialog
      const deleteRecipeId = +event.currentTarget.getAttribute(['data-recipe-id']);
      this.setState({ deleteRecipeId });
  };

  onDeleteRecipeClose = (deleted) => {
    if (deleted) {
      const { deleteRecipeId, recipes } = this.state;
      this.setState({
        recipes: recipes.filter(recipe => recipe.id !== deleteRecipeId)
      })
    }
    this.setState({ deleteRecipeId: null });
  }

  render() {
    const { recipes, deleteRecipeId } = this.state;
    const mode = Recipes.modes[this.props.mode];
    const { actions } = mode;

    return (
      <div className="recipes">
        <h1>{mode.title}</h1>
        <table>
          <thead>
            <tr><th className="col-id">ID</th>
              <th className="col-title">Description</th>
              {actions ? <th className="col-actions">Actions</th> : ''}
            </tr>
          </thead>
          <tbody>
            {recipes.map(recipe => (
              <tr key={recipe.id}>
                <td className="col-id">{recipe.id}</td>
                <td className="col-title">
                  <div className="name">{recipe.name}</div>
                  {recipe.description ? <div className="description">{recipe.description}</div> : ''}
                </td>
                {actions ? (
                  <td className="col-actions">
                    {actions.view ? <button className="action-view" type="button" data-recipe-id={recipe.id} onClick={this.onViewRecipeClick} >View</button> : ''}
                    {actions.edit ? <button className="action-edit" type="button" data-recipe-id={recipe.id} onClick={this.onEditRecipeClick} >Edit</button> : ''}
                    {actions.delete ? <button className="action-delete" type="button" data-recipe-id={recipe.id} onClick={this.onDeleteRecipeClick} >Delete</button> : ''}
                  </td>
                ) : ''}
              </tr>
            ))}
          </tbody>
        </table>
        {deleteRecipeId !== null ? <DeleteRecipe recipeId={deleteRecipeId} onClose={this.onDeleteRecipeClose} /> : ''}
      </div>
    );
  }
}

export default withRouter(Recipes);
