import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import './ViewRecipe.css';

class ViewRecipe extends Component {
  static propTypes = {
    recipeId: PropTypes.number.isRequired,
    onError: PropTypes.func,
    history: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    onError: null
  };

  constructor() {
    super();

    this.state = {
      recipe: null
    };
  }

  componentWillMount() {
    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    fetch(`/api/recipe/${this.props.recipeId}`, {
      credentials: 'same-origin', // include, same-origin, *omit
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
        this.setState({ recipe: recipe || null });
      });
  }

  onBackClick = () => this.props.history.goBack();

  render() {
    const { recipe } = this.state;

    if (!recipe) {
      return <div className="loading">Loading...</div>;
    }

    return (
      <div className="view-recipe">
        <div className="card container ">
          <div className="card-header">
            <h1 className="card-header-title">View Recipe</h1>
          </div>
          <div className="card-content">
            <div className="content">
              <p>
                Name: <b> {recipe.name}</b>
              </p>
              <p>
                Cook time: <b>{recipe.cookTime} min</b>
              </p>
              <p>
                Servings: <b>{recipe.servings}</b>
              </p>
              <p>
                Source:
                <b>
                  <a target="_blank" href={`www.${recipe.source}/`}>
                    {recipe.source}
                  </a>
                </b>
              </p>
              <p>
                Instructions: <b>{recipe.instructions}</b>
              </p>
              <div className="columns wrapper">
                <div className="card column is-6">
                  <div className="card-header has-background-light">
                    <p className="card-header-title">Ingerdients</p>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <table>
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Unit of measurement</th>
                            <th>Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(recipe.ingredients || []).map((ingredient, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{ingredient.amount}</td>
                                <td>{ingredient.uom}</td>
                                <td>{ingredient.name}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card column is-6">
                  <div className="card-header has-background-light">
                    <p className="card-header-title">Nutririons</p>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <table>
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Type of nutririon</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(recipe.nutritions || []).map((nutrition, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{nutrition.amount} gr</td>
                                <td>{nutrition.ton}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={this.onBackClick}>Back</button>
      </div>
    );
  }
}

export default withRouter(ViewRecipe);
