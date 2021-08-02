import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import DishDetail from './DishdetailComponent';
import About from './AboutComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Favourites from './FavouriteComponent';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import {postComment, postFeedback, fetchDishes, fetchComments, fetchPromos, fetchLeaders} from '../redux/ActionCreators';
import {actions} from 'react-redux-form';
import {TransitionGroup, CSSTransition} from 'react-transition-group'

//map reduxstore state into props for the component 
const mapStateToProps = state =>{
    return{
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
}

const mapDispatchToProps = (dispatch) => ({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId,rating,author,comment)),
  postFeedback: (firstname,lastname,telnum,email,agree,contactType,message) => dispatch(postFeedback(firstname,lastname,telnum,email,agree,contactType,message)),
  fetchDishes: () =>{dispatch(fetchDishes())},
  resetFeedbackForm: () => {dispatch(actions.reset('feedback'))},
  fetchComments: () =>{dispatch(fetchComments())},
  fetchPromos: () =>{dispatch(fetchPromos())},
  fetchLeaders: () => {dispatch(fetchLeaders())}
})



class Main extends Component {
  constructor(props) {
    super(props);
}


  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  onDishSelect(dishId) {
    this.setState({ selectedDish: dishId});
  }

  render() {
    
    const HomePage = () =>{
        return(
            <Home 
            dish={this.props.dishes.dishes.filter((dish)=>dish.featured)[0]}
            dishesLoading={this.props.dishes.isLoading}
            dishesErrMess = {this.props.dishes.errMess}
            promotion={this.props.promotions.promotions.filter((promo)=>promo.featured)[0]}
            promosLoading={this.props.promotions.isLoading}
            promosErrMess = {this.props.promotions.errMess}
            leader={this.props.leaders.leaders.filter((leader)=>leader.featured)[0]}
            leadersLoading = {this.props.leaders.isLoading}
            leadersErrMess = {this.props.leaders.errMess}
            />
        );
    };

    const DishWithId = ({match}) =>{
        return (
            this.props.auth.isAuthenticated
            ?
            <DishDetail dish={this.props.dishes.dishes.filter((dish)=> dish.id=== parseInt(match.params.dishId,10))[0]}
            isLoading={this.props.dishes.isLoading}
            errMess = {this.props.dishes.errMess}
            comments = {this.props.comments.comments.filter((comment)=> comment.dishId === parseInt(match.params.dishId,10))}
            commentsErrMess = {this.props.comments.errMess}
            postComment={this.props.postComment}
            favourite={this.props.favourites.favourites.dishes.some((dish) => dish._id === match.params.dishId)}
            postfavourite={this.props.postfavourite}
            />
            :
            <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish._id === match.params.dishId)[0]}
            isLoading={this.props.dishes.isLoading}
            errMess={this.props.dishes.errMess}
            comments={this.props.comments.comments.filter((comment) => comment.dish === match.params.dishId)}
            commentsErrMess={this.props.comments.errMess}
            postComment={this.props.postComment}
            favourite={false}
            postFavourite={this.props.postFavourite}
            />
        );

    };
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.props.auth.isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }} />
      )} />
    );


    return (
      <div>
        <Header />
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames='page' timeout={300}>
            <Switch>
                <Route path="/home" component={HomePage}/>
                <Route exact path='/menu' component={()=><Menu dishes={this.props.dishes}/>}/>
                <Route exact path='/aboutus' component = {()=> <About leaders={this.props.leaders}/>} />
                <Route path='/menu/:dishId' component={DishWithId}/>
                <PrivateRoute exact path="/favourites" component={() => <Favourites favourites={this.props.favourites} deleteFavourite={this.props.deleteFavourite} />} />
                <Route exact path='/contactus' component={()=><Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback = {this.props.postFeedback}/>}/>
                <Redirect to="/home"/>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer/>
      </div>
    );
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));