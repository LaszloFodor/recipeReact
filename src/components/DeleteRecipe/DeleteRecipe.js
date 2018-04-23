import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import { Dialog } from 'components';

class DeleteRecipe extends Component {

  static propTypes = {
    recipeId: PropTypes.number.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onClose: () => { },
  };

  constructor() {
    super();

    this.state = {
      error: null,
    };
  }

  deleteRecipe = () => {
    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
      //   headers['Accept'] = '*/*',
      headers['Content-Type'] = 'application/json; charset=utf-8'
    }

    fetch(`/api/recipe/${this.props.recipeId}`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + accessToken
      }

    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Error in server response!');
        }
        return response.json();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      })
      .then((recipe) => {
        this.props.onClose(true);
      });
  };

  onDialogButtonClick = (buttonId, event) => {
    if (buttonId === 'YES') {
      this.deleteRecipe();
    } else if (buttonId === 'NO') {
      this.props.onClose(false);
    }
  }

  render() {
    const { error } = this.state;
    return <Dialog title="Confirmation" message="Would you like to delte the recipe?" error={error} onButtonClick={this.onDialogButtonClick} />
  }

}

export default withRouter(DeleteRecipe);