import Search from './model/Search';
import Recipe from './model/Recipe';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import {elements, renderLoader, clearLoader} from './view/base';

/**
 * Global state of the app
 * - Search controller
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controllSearch = async () => {
    const query = searchView.getInput();

    if(query) {
        state.search = new Search(query);

        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Error processing search!');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if(id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search) searchView.highlightSelected(id);
        state.recipe = new Recipe(id);
        
        try {

            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe.ingredients);
            state.recipe.calcTime();
            state.recipe.calcServings();

            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            alert('Error processing recipe!');
            console.log(error);
        }
    }
};
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));