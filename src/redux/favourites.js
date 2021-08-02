import * as ActionTypes from './ActionTypes';

export const favourites = (state = {
        isLoading: true,
        errMess: null,
        favourites: null
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_FAVOURITES:
            return {...state, isLoading: false, errMess: null, favourites: action.payload};

        case ActionTypes.FAVOURITES_LOADING:
            return {...state, isLoading: true, errMess: null, favourites: null};

        case ActionTypes.FAVOURITES_FAILED:
            return {...state, isLoading: false, errMess: action.payload, favourites: null};

        default:
            return state;
    }
}