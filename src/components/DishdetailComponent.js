/* eslint-disable react/jsx-pascal-case */
import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle
,Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody,  Label, Button, Row,Col} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control, LocalForm, Errors} from "react-redux-form";
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl'; 
import {FadeTransform, Fade, Stagger} from 'react-animation-components';


const maxLength = (len) => (val) => !(val) || (val.length<=len);
const minLength = (len) => (val) => (val) && (val.length>=len);
const required = (val) => val && val.length;

    class CommentForm extends Component{
        constructor(props){
            super(props);
            this.state={
                isModalOpen: false
            };
            this.handleSubmit = this.handleSubmit.bind(this);
            this.toggleModal = this.toggleModal.bind(this);
        }
            
    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }
    
      render(){
          return(
            <React.Fragment>
            <Button outline onClick={this.toggleModal}><span className="fa  fa-pencil-square-o fa-lg"></span> Submit Comment</Button>
            
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} >
                
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)} className="container" >

                            <Row className="form-group">
                            <Label htmlFor="rating" md={12}>Rating</Label>
                            <Col md={12}>
                            
                            <Control.select model=".rating" name="rating"
                            className="form-control">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                            </Control.select>
                            </Col>
                            
                            </Row>

                            <Row className="form-group">
                            <Label htmlFor="author" md={12} >Your Name </Label>
                            <Col md={12}>
                            <Control.text model=".author" id="author" name="author"
                                placeholder="Your Name"
                                className="form-control"
                                validators={{
                                    required,minLength: minLength(3) , maxLength: maxLength(15)
                                }}
                                    />
                                    <Errors
                                    className = 'text-danger'
                                    model=".author"
                                    show="touched"
                                    messages={{
                                        required: 'Required ',
                                        minLength: 'Must be greater than 2 character ',
                                        MaxLength: 'Must be 15 characters or less '
                                    }}
                                    />
                            </Col>
                            </Row>

                            <Row className="form-group">
                            <Label htmlFor="Comment" md={12}>Your Feedback</Label>
                            <Col md={12}>
                            <Control.textarea model=".comment" id="comment" name="comment"
                             rows="6" className="form-control" />
                            </Col>
                            </Row>

                        
                            
                            <Button type="submit" color="primary">Submit</Button>
                           

                        </LocalForm>
                    </ModalBody>
                    
            </Modal>
            
            </React.Fragment>
        
          )
      }

}



    function RenderDish({dish}) {
            return(
                <div  className="col-12 col-md-5 m-1">
                <FadeTransform in 
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                    <Card>
                        <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                          <CardTitle>{dish.name}</CardTitle>
                          <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
                </div>
                );
        }

    function RenderComments({comments, postComment, dishId}){
            if (comments!=null){
                return(
                    <div className="col-12 col-md-5 m-1">
                        <h4>Comments</h4>
                        <ul className='list-unstyled'>
                            <Stagger in>
                            {comments.map((comment)=>{
                                return (
                                    <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>-- {comment.author}, {comment.date}</p>
                                    </li>
                                    </Fade>
                                );
                            })}
                            </Stagger>
                        </ul>
                        
                        
                        <CommentForm dishId={dishId} postComment={postComment}/>
                    </div>
                                    
                );}

            else
                console.log("no comments");
                return(
            
                    <div></div>
                );
        }
    


    const DishDetail = (props) => {
        if (props.isLoading){
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );

        }

        else if (props.dish!=null)
            return(
                <div className = "container">
                <div className = "row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className ="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} />
                    <RenderComments comments={props.comments}
                    postComment={props.postComment}
                    dishId={props.dish.id} />
                    
                </div>
                </div>
            )
        else
            return <div></div>

    }

    


export default DishDetail;