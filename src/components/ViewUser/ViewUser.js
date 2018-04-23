import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import { Dialog } from 'components'

class ViewUser extends Component {

  static propTypes = {
    // userId: PropTypes.number.isRequired,
    onDelete: PropTypes.func,
    onError: PropTypes.func,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    user: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  };


  static defaultProps = {
    onError: null,
  };

  constructor() {
    super();
    this.state = {
      showConfirmDialog: false
    };
  }

  // onEditUserClick = () => {

  // }
  onDeleteUserClick = () => {
    this.setState({ showConfirmDialog: true });
  };

  deleteUser = () => {
    const headers = {};
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }
    fetch(`/api/user/myprofile`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers,
    }).
      then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Unable to retrieve user information!');
        }
        this.setState({ showConfirmDialog: false });
        this.props.onDelete()
      })
      .catch((error) => {
        window.console.log(error);
      });
  };

  onDeleteButtonClick = (buttonId) => {
    if (buttonId === 'YES') {
      this.deleteUser();
    } else if (buttonId === 'NO') {
      this.setState({ showConfirmDialog: false });
    }
  }
  render() {
    return (
      <div className="user-profile">
        <button onClick={this.onEditUserClick}>Edit</button>
        <button onClick={this.onDeleteUserClick}>Delete</button>
        {this.state.showConfirmDialog ? <Dialog title="Confirmation" message="Would you like to delete your profile?" onButtonClick={this.onDeleteButtonClick} /> : ''}
        <div>
          <p>sajt</p>
        </div>
      </div>
    );

  }

}
export default withRouter(ViewUser);




