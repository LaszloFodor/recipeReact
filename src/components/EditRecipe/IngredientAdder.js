import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

export class IngredientAdder extends Component {
  onInputChange = event => this.setState({ [event.target.name]: event.target.value });

  onSelect = event => this.setState({ selectedUnit: event.target.value });

  state = {
    uom: null,
    onInputChange: this.onInputChange,
    onSelect: this.onSelect,
    selectedUnit: null
  };
  componentDidMount = () => {
    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    fetch(`/api/recipe/unitofmeasurements`, {
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
      .then(uom => {
        this.setState({ uom });
      });
  };

  render() {
    return this.props.children(this.state);
  }
}

export default IngredientAdder;
