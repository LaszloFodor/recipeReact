import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

class EditRecipe extends Component {
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

    componentDidMount() {
        
        const headers = {};
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          headers['Authorization'] = 'Bearer ' + accessToken;
        }

        fetch(`/api/recipe/${this.props.recipeId}`, {
            credentials: 'same-origin',
            method: 'GET',
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
            .then((recipe) => {
                this.setState({ recipe: recipe || null });
            });
    }

    onSubmitForm = (event) => {
        const { recipe } = this.state;
        event.preventDefault();

        const headers = {};
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          headers['Authorization'] = 'Bearer ' + accessToken;
        }

        fetch(`/api/recipe/${recipe.id}`, {
            credentials: 'same-origin',
            method: 'PUT',
            body: JSON.stringify(recipe),
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
            .then((recipe) => {
                this.setState({ recipe: recipe || null });
            });
    };

    onInputChange = (event) => {
        // update the field value in state
        const { recipe } = this.state;
        const { id, value } = event.currentTarget;

        const idParts = id.split('.');
        const dataId = +event.currentTarget.getAttribute('data-id');
        // in case id has no dot in the id we simply apply the change
        if (idParts.length === 1) {
            // in case dataId is defined recipe[id] is an array, we need to update array item with a specific id
            if (dataId) {
                const items = [...recipe[id]]; 
                const itemIdx = items.findIndex(item => item.id === dataId);
                items[itemIdx] = value;
                this.setState({ recipe: { ...recipe, [id]: items }})
            } else {
                this.setState({ recipe: { ...recipe, [id]: value }});               
            } 
            return;
        }

        // in case of dot we check for dataId and update the item regarding to its value
        const subItems = recipe[idParts[0]];
        if (dataId) {
            const items = [...subItems];
            const itemIdx = items.findIndex(item => item.id === dataId);
            items[itemIdx][idParts[1]] = value;
            this.setState({ recipe:  {...recipe, [idParts[0]]: items }});
        } else {
            const props = {...subItems, [idParts[1]]: value};
            this.setState({ recipe: { ...recipe, [idParts[0]]: props }});                           
        }
        
    };

    onBackClick = () => this.props.history.goBack();

    render() {
        const { recipe } = this.state;
        const { ingredients, nutritions, categories } = recipe || {};

        if (!recipe) {
            return <div className="edit-recipe">Loading or no recipe found...</div>;
        }

        return (
            <form className="edit-recipe" onSubmit={this.onSubmitForm}>
                <div className="recipe">
                    <div className="name">
                        <label htmlFor="name">Recipe name:</label>
                        <input type="text" id="name" value={recipe.name} onChange={this.onInputChange} />
                    </div>
                    <div className="serving">
                        <label htmlFor="serving">Servings:</label>
                        <input type="text" id="servings" value={recipe.servings} onChange={this.onInputChange} />
                    </div>
                    <div className="cookTime">
                        <label htmlFor="cookTime">Cook Time:</label>
                        <input type="text" id="cookTime" value={recipe.cookTime} onChange={this.onInputChange} />
                    </div>
                    <div className="source">
                        <label htmlFor="source">Source:</label>
                        <input type="text" id="source" value={recipe.source} onChange={this.onInputChange} />
                    </div>
                    <ul className="ingredients">
                        <label htmlFor="ingredients">Ingredients:</label>
                        {(ingredients || []).map(ingredient =>
                            <li key={ingredient.id}>
                                <input type="text" id="ingredients.name" data-id={ingredient.id} value={ingredient.name} onChange={this.onInputChange} />
                            </li>
                        )}
                    </ul>

                    <ul className="nutritions">
                        <label htmlFor="nutritions">Nutritions:</label>
                        {(nutritions || []).map((nutrition, idx) =>
                            <li key={nutrition.id}>
                                <input type="text" id="nutritions.amount" data-id={nutrition.id} value={nutrition.amount} onChange={this.onInputChange} />
                                <input type="text" id="nutritions.type" data-id={nutrition.id} value={nutrition.type} onChange={this.onInputChange} />
                            </li>
                        )}
                    </ul>

                    <ul className="categories">
                        <label htmlFor="categories">Categories:</label>
                        {(categories || []).map(category =>
                            <li key={category.id}>
                                <input type="text" id="categories.name" data-id={category.id} value={category.name} onChange={this.onInputChange} />
                            </li>
                        )}
                    </ul>

                    <ul className="difficulty">
                        <label htmlFor="difficulty">Difficulty:</label>
                        <input type="text" id="difficulty" value={recipe.difficulty} onChange={this.onInputChange} />
                    </ul>

                </div>
                <div className="actions">
                    <button type="submit">Edit</button>
                    <button type="button" onClick={this.onBackClick}>Close</button>
                </div>
            </form>
        );
    }
}

export default withRouter(EditRecipe);