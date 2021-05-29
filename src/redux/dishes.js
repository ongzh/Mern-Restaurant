import { DISHES } from '../shared/dishes';

// if state undefined then DISHES
export const Dishes = (state=DISHES, action) =>{
    switch(action.type){
        default: 
            return state;

    }
}