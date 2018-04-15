import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import './ViewRecipe.css';

class ViewRecipe extends Component {
  static propTypes = {
    recipeId: PropTypes.number.isRequired,
    onError: PropTypes.func,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    onError: null,
  };

  constructor() {
    super();

    this.state = {
      recipe: null,
    };
  }

  componentWillMount() {
    fetch(`/api/recipe/${this.props.recipeId}`, {
      credentials: 'same-origin', // include, same-origin, *omit
      /*
      method: 'GET', // use POST, PUT or DELETE here
      body: JSON.stringify(bodyObjectOrArrey),
      headers: {
        'Authentication': 'Bearer << here goes the JWTtoken >>',
      },
*/
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
      .then((recipe) => {
        this.setState({ recipe: recipe || null });
      });
  }

  onBackClick = () => this.props.history.goBack();

  render() {
    const { recipe } = this.state;

    return (
      <div className="view-recipe">
        <h1>View Recipe</h1>
        {recipe ? <div>{JSON.stringify(recipe)}</div> : <div className="loading">Loading...</div>}
        <button onClick={this.onBackClick}>Back</button>
      </div>
    );
  }
}

export default withRouter(ViewRecipe);
