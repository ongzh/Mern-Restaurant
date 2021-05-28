import { DISHES } from './shared/dishes';
import { LEADERS } from './shared/leaders';
import { COMMENTS } from './shared/comments';
import { PROMOTIONS } from './shared/promotions';

export const initialState = {
    dishes: DISHES,
    comments: COMMENTS,
    promotions: PROMOTIONS,
    leaders: LEADERS 
};

//default value is intialState if state is udnefined
export const Reducer = (state = initialState,action) =>{
    return state;
};




