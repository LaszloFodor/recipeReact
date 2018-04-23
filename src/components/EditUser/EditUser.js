import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

class EditUser extends Component {

  static propTypes = {
    onError: PropTypes.func,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

static defaultProps = {
  onError: null,
};

}