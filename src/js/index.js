import Search from './model/Search';
import * as searchView from './view/searchView';
import {elements, renderLoader, clearLoader} from './view/base';

/**
 * Global state of the app
 * - Search controller
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controllSearch = async () => {
    const query = searchView.getInput();

    if(query) {
        state.search = new Search(query);

        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        await state.search.getResults();
        clearLoader();
        searchView.renderResults(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});

const search = new Search('pizza');