import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';


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

    onSubmitForm = (event) => {

        event.preventDefault();

        fetch(`/api/recipe/${this.props.recipeId}`, {
            credentials: 'same-origin',
            method: 'DELETE',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json; charset=utf-8',
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

    onNoClick = (event) => {
        this.props.onClose(false);
    }

    render() {
        const { error } = this.state;
        return (
            <form className="delete-dialog" onSubmit={this.onSubmitForm}>
                <div className="title">Are you sure?</div>
                <div className="content">
                    {error ? <div className="error-message">{error}</div> : ''}
                </div>
                <div className="actions">
                    <button type="submit">Yes</button>
                    <button type="button" onClick={this.onNoClick}>No</button>
                </div>
            </form>
        );
    }

}

export default withRouter(DeleteRecipe);