import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import logo from 'resources/images/logo.svg';
import { ViewRecipe, Recipes, LoginDialog, EditRecipe } from 'components';
import './App.css';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor() {
    super();

    this.state = {
      user: null,
      showLoginDialog: false,
      loggingOut: false,
    };
  }

  componentWillMount() {
    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    fetch('/api/whoami', { //TODO: change to  '/api/userinfo' when security is available
      credentials: 'same-origin', // include, same-origin, *omit
      headers,     
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Unable to retrieve user information!');
        }
        return response.json();
      })
      .catch((error) => {
        window.console.log(error);
      })
      .then((user) => {
        this.setState({ user: user || null });
      });
  }

  onError = (error) => {
    window.console.log(error);
    // TODO: handle error application level (eg. set a state, and display a dialog)
  };

  onLoginClick = () => {
    // show login form by state
    this.setState({ showLoginDialog: true });
  };

  onLoggedIn = (user, accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    this.setState({
      showLoginDialog: false,
      user
    });
  };

  onLoginClose = () => {
    this.setState({ showLoginDialog: false });
  };

  onLogoutClick = () => {
    // show logout message and masks application
    this.setState({ loggingOut: true });

    // call logout rest and delete user data
    fetch('/api/logout', {
      credentials: 'same-origin', // include, same-origin, *omit
    }).then(() => {
      localStorage.removeItem('accessToken');
      this.setState({
        user: null,
        accessToken: null,
        loggingOut: false,
      });
      this.props.history.replace('/');
    });
  };

  render() {
    const { user, loggingOut, showLoginDialog } = this.state;
    return (
      <div className="app">
        <header className="app-header">
          <img className="app-logo" src={logo} alt="logo" />
          <div className="app-title">Recipes</div>
          {user ? (
            <div className="user-info">
              <div className="logged-user">
                <span className="user-name">{user.userName}</span>
                <span className="user-fullname">({user.firstName} {user.lastName})</span>
              </div>
              <button onClick={this.onLogoutClick}>Logout</button>
            </div>
          ) : (
            <div className="user-info">
              <button onClick={this.onLoginClick}>Login</button>
            </div>
          )}
        </header>
        <Switch>
          <Route exact path="/my-recipes" render={() => <Recipes mode="my" onError={this.onError} />} />
          <Route exact path="/view-recipe/:id" render={props => <ViewRecipe recipeId={+props.match.params.id} onError={this.onError} />} />

          <Route exact path="/edit-recipe/:id" render={props => <EditRecipe recipeId={+props.match.params.id} onError={this.onError} />} />

          <Route render={() => <Recipes mode="all" onError={this.onError} />} />
        </Switch>
        {loggingOut || showLoginDialog ? <div className="mask" /> : ''}
        {showLoginDialog ? <LoginDialog onLoggedIn={this.onLoggedIn} onClose={this.onLoginClose} /> : ''}
      </div>
    );
  }
}

export default withRouter(App);
