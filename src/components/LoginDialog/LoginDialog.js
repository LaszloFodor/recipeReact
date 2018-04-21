import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import './LoginDialog.css';

class LoginDialog extends Component {
  static propTypes = {
    onLoggedIn: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onLoggedIn: () => {},
    onClose: () => {},
  };

  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      error: null,
    };
  }

  onInputChange = (event) => {
    // update the field value in state
    this.setState({ [event.currentTarget.id]: event.currentTarget.value });
  };

  onSubmitForm = (event) => {
    // do not submit the form automatically, we will do it by REST call
    event.preventDefault();

    const { username, password } = this.state;

    // call login service
    fetch('/auth/login', { // TODO: /api/login
      credentials: 'same-origin', // include, same-origin, *omit
      method: 'POST', // TODO: change method to POST
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Unable to log in user!');
        }
        return response.json();
      })
      .catch((error) => {
        window.console.log(error);
      })
      .then((data) => {
        const { user, access_token} = data || {};
        // in case of failure login: set error message
        if (!user || !access_token) {
          // in case of successful login: call the `onLoggedIn` callback method
          this.setState({ error: 'Invalid user name or password, please try again!' });
          return;
        }
        this.props.onLoggedIn(user, access_token);
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="login-dialog" onSubmit={this.onSubmitForm}>
        <div className="title">Login :: Please Enter Your Credentials</div>
        <div className="content">
          <div className="username">
            <label htmlFor="username">User name:</label>
            <input type="text" id="username" value={this.state.username} onChange={this.onInputChange} />
          </div>
          <div className="password">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={this.state.password} onChange={this.onInputChange} />
          </div>
          {error ? <div className="error-message">{error}</div> : ''}
        </div>
        <div className="actions">
          <button type="submit">Login</button>
          <button type="button" onClick={this.props.onClose}>Close</button>
        </div>
      </form>
    );
  }
}

export default LoginDialog;
