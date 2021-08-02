import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';


export const addComment = (comment) =>({
    type: ActionTypes.ADD_COMMENT,
    payload:comment});

export const postComment = (dishId,rating,author,comment) => (dispatch) => {

    const newComment = {
            dishId: dishId,
            rating: rating,
            author: author,
            comment: comment}
        
    
    newComment.date = new Date().toISOString();

    return fetch(baseUrl + 'comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers:{
            'Content-Type':'application/json'
        },
        credentials:'same-origin'
    })
        .then(response=>{
            if (response.ok){
                return response;
            }
            else{
                var error = new Error('Error' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response=> dispatch(addComment(response)))
        .catch(error=> {console.log('Post comments',error.message);
        alert('Your comment could not be posted\nError: '+ error.message)})
}

export const postFeedback = ( 
    firstname,
    lastname,
    telnum,
    email,
    agree,
    contactType,
    message) => (dispatch) => {
    
    const newFeedback = {
        firstname: firstname,
        lastname: lastname,
        telnum: telnum,
        email: email,
        agree: agree,
        contactType: contactType,
        message: message
    }

    return fetch(baseUrl + 'feedback', {
        method: 'POST',
        body: JSON.stringify(newFeedback),
        headers:{
            'Content-Type':'application/json'
        },
        credentials:'same-origin'
    })
        .then(response=>{
            if (response.ok){
                return response;
            }
            else{
                var error = new Error('Error' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response=> alert("Thank you for the feedback" + JSON.stringify(response)))
        .catch(error=> {console.log('Post feedback',error.message);
        alert('Your feedback could not be posted\nError: '+ error.message)})
}

export const fetchDishes = () => (dispatch) => {
    dispatch(dishesLoading(true));
    
    return fetch(baseUrl + 'dishes')
        .then(response=>{
            if (response.ok){
                return response;
            }
            else{
                var error = new Error('Error' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(dishes => dispatch(addDishes(dishes)) )
        .catch(error => dispatch(dishesFailed(error.message)));
}

export const fetchComments = () => (dispatch) => {
    
    return fetch(baseUrl + 'comments')
    .then(response=>{
        if (response.ok){
            return response;
        }
        else{
            var error = new Error('Error' + response.status + ': ' + response.statusText)
            error.response = response;
            throw error;
        }
    },
    error =>{
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(comments => dispatch(addComments(comments)))
    .catch(error => dispatch(promosFailed(error.message)));
        
}

export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading(true));
    
    return fetch(baseUrl + 'promotions')
        .then(response=>{
            if (response.ok){
                return response;
            }
            else{
                var error = new Error('Error' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        },
        error =>{
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(promos => dispatch(addPromos(promos)))
        .catch(error => dispatch(promosFailed(error.message)));
}

export const fetchLeaders = () => (dispatch) => {
    dispatch(leadersLoading(true));
    
    return fetch(baseUrl + 'leaders')
        .then(response=>{
            if (response.ok){
                return response;
            }
            else{
                var error = new Error('Error' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        },
        error =>{
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(leaders => dispatch(addLeaders(leaders)))
        .catch(error => dispatch(leadersFailed(error.message)));
}

export const leadersLoading = () =>({
    type: ActionTypes.LEADERS_LOADING
});

export const dishesLoading = () => ({
    type: ActionTypes.DISHES_LOADING
});

export const promosLoading = () => ({
    type: ActionTypes.PROMOS_LOADING
});

export const promosFailed = (errmess) => ({
    type:ActionTypes.PROMOS_FAILED,
    payload: errmess
});

export const commentsFailed = (errmess) => ({
    type:ActionTypes.COMMENTS_FAILED,
    payload: errmess
});

export const dishesFailed = (errmess) => ({
    type:ActionTypes.DISHES_FAILED,
    payload: errmess
});

export const leadersFailed = (errmess) => ({
    type: ActionTypes.LEADERS_FAILED,
    payload: errmess
})

export const addLeaders = (leaders) => ({
    type: ActionTypes.ADD_LEADERS,
    payload: leaders 
})


export const addPromos = (promos) => ({
    type:ActionTypes.ADD_PROMOS,
    payload: promos 
});

export const addComments = (comments) => ({
    type:ActionTypes.ADD_COMMENTS,
    payload: comments
});


export const addDishes = (dishes) => ({
    type: ActionTypes.ADD_DISHES,
    payload: dishes 
})

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}
  
export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            // If login was successful, store the token and credentials in local storage 
            localStorage.setItem('token', response.token);
            localStorage.setItem('creds', JSON.stringify(creds));
            // Dispatch the success action 
            dispatch(fetchfavourites());
            dispatch(receiveLogin(response));
        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error.message)))
};

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    dispatch(favouritesFailed("Error 401: Unauthorized"));
    dispatch(receiveLogout())
}

export const postFavourite= (dishId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'favourites/' + dishId, {
        method: "POST",
        body: JSON.stringify({"_id": dishId}),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(favourites => { console.log('FavouriteAdded', favourites); dispatch(addFavourites(favourites)); })
    .catch(error => dispatch(favouritesFailed(error.message)));
}

export const deleteFavourite= (dishId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'favourites/' + dishId, {
        method: "DELETE",
        headers: {
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(favourites => { console.log('FavouriteDeleted', favourites); dispatch(addFavourites(favourites)); })
    .catch(error => dispatch(favouritesFailed(error.message)));
};

export const fetchfavourites = () => (dispatch) => {
    dispatch(favouritesLoading(true));
    //authorisation (user authentication)
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'favourites', {
        headers: {
            'Authorization': bearer
        },
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    //add into redux store afterwards
    .then(favourites => dispatch(addFavourites(favourites)))
    .catch(error => dispatch(favouritesFailed(error.message)));
}

export const favouritesLoading = () => ({
    type: ActionTypes.FAVOURITES_LOADING
});

export const favouritesFailed = (errmess) => ({
    type: ActionTypes.FAVOURITES_FAILED,
    payload: errmess
});

export const addFavourites = (favourites) => ({
    type: ActionTypes.ADD_FAVOURITES,
    payload: favourites
});