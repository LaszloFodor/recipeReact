import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dialog extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    error: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string
    })),
    onButtonClick: PropTypes.func
  };

  static defaultProps = {
    buttons: [{
      id: 'YES',
      text: 'Yes',
    }, {
      id: 'NO',
      text: 'No'
    }],
    error: null,
    onButtonClick: () => { },
  };

  onButtonClick = (event) => {
    const buttonId = event.target.getAttribute('data-id');
    this.props.onButtonClick(buttonId, event);
  };

  render() {
    const { title, message, buttons, error } = this.props;
    return [
      <div key="mask" className="mask" />,
      <form key="form" className="dialog" onSubmit={this.onSubmitForm}>
        <div className="title">{title}</div>
        <div className="content">
          <div className="message">{message}</div>
          {error ? <div className="error-message">{error}</div> : ''}
        </div>
        <div className="actions">
          {buttons.map(button => (
            <button type="button" key={button.id} data-id={button.id} onClick={this.onButtonClick}>{button.text}</button>
          ))}
        </div>
      </form>
    ];
  }

}

export default Dialog;