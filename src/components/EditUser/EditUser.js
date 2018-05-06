import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

class EditUser extends Component {

  static propTypes = {
    user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onError: PropTypes.func,
    onUpdate: PropTypes.func,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    onError: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {
        ...props.user
      }
    }
  }

  onSubmitForm = (event) => {
    const { user } = this.state;
    event.preventDefault();

    const headers = {
      Accept: '*/*',
      'Content-Type': 'application/json; charset=utf-8',
    };

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    fetch(`/api/user/${user.id}`, {
      credentials: 'same-origin',
      method: 'PUT',
      body: JSON.stringify(user),
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
      .then((user) => {
        this.setState({ user });
        this.props.onUpdate(user);
    });
  };

  onInputChange = (event) => {
    this.setState({user: {
      ...this.state.user,
      [event.currentTarget.id]: event.currentTarget.value
    }})
  };

  onBackClick = () => this.props.history.goBack();

  render() {

    const { user } = this.state;

    if (!user) {
      return <div className="edit-user">No user information available yet. Try to login again!</div>
    }

    return (
      <form className="edit-user" onSubmit={this.onSubmitForm}>
        <div>
          <div className="user-name">
            <label htmlFor="name">Username:</label>
            <input type="text" id="name" value={user.username} onChange={this.onInputChange} />
          </div>
          {/* <div className="user-password">
            <label htmlFor="name">Password:</label>
            <input type="password" id="password" value={user.password} onChange={this.onInputChange} />
          </div> */}
          <div className="user-firstname">
            <label htmlFor="firstName">First name:</label>
            <input type="text" id="firstName" value={user.firstName} onChange={this.onInputChange} />
          </div>
          <div className="user-lastname">
            <label htmlFor="lastName">Last name:</label>
            <input type="text" id="lastName" value={user.lastName} onChange={this.onInputChange} />
          </div>
          <div className="user-email">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" value={user.email} onChange={this.onInputChange} />
          </div>
        </div>
        <div className="actions">
          <button type="submit">Save</button>
          <button type="button" onClick={this.onBackClick}>Back</button>
        </div>
      </form>
    );



  }

}

export default withRouter(EditUser);