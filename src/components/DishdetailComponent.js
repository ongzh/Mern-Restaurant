import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle } from 'reactstrap';

class DishDetail extends Component{
    constructor(props){
        super(props);

        this.state = {stes: null};
    }

        renderDish(dish) {
            
                return(
                    <Card>
                        <CardImg top src={dish.image} alt={dish.name} />
                        <CardBody>
                          <CardTitle>{dish.name}</CardTitle>
                          <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                );
        }

        renderComments(comments){
            if (comments!=null){
                let commlist = comments.map((comment) => {
                    let date = new Intl.DateTimeFormat('en-US', {
                        year:'numeric',
                        month: 'short',
                        day: '2-digit'
                    }).format(new Date(Date.parse(comment.date)))
                    
                    return (
                            <ul key={comment.id} className="list-unstyled">
                                <li className="comment">{comment.comment}</li>
                                <li className="author">-- {comment.author}, {date}</li>
                            </ul>
                        );
                    })
                return(
                    <div className="col-12 col-md-5 m-1">
                        <h4>Comments</h4>
                        {commlist}
                    </div>
                );}

            else
                return(
                    <div></div>
                );
        }


        render(){
            const dish = this.props.dish;
            if (dish!=null)
                return(
                    <div className = "container">
                        <div className = "row">
                        <div  className="col-12 col-md-5 m-1">
                        {this.renderDish(dish)}
                        </div>
                        {this.renderComments(dish.comments)}
                        </div>

                    </div>
                )
            else
                return <div></div>

        }

    

}

export default DishDetail;