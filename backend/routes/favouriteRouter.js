const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favourites = require('../models/favourites');
const cors = require('./cors');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Favourites.find({})
    .populate('name')
    .populate('dishes')
    .then((favourites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favourites);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOne({name: req.user._id})
    .then((favourite)=>{
        if (favourite == null){
            Favourites.create({'name':req.user._id, 'dishes':req.body})
            .then((favourite)=>{
                for (i=0; i< req.body.length; i++){
                    if (favourite.dishes.indexOf(req.params.dishId)){
                        favourite.dishes.push(req.body[i]);
                    }
                }
                favourite.save()
                .then((favourite)=> {
                    Favourites.findById(favourite._id)
                    .populate('name')
                    .populate('dishes')
                    .then((favourite)=>{
                        console.log("Favourite created")
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favourite);
                    })                   
                })
                })
        }
        else{
            for (const i of req.body){
                if (favourite.dishes.indexOf(req.params.dishId)){
                    continue;
                }
                else{
                    favourite.dishes.push(req.body[i])
                }
            }
            favourite.save()
            .then((favourite)=> {
                Favourites.findById(favourite._id)
                .populate('name')
                .populate('dishes')
                .then((favourite)=>{
                    console.log("Favourite created")
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                })                   
        })

    }},(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /favourites');
})
//must restrict
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOneAndRemove({'name': req.user._id})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res)=>{res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favourites.findOne({user: req.user._Id})
    .then((favourites)=>{
        if (!(favourites)){
           res.statusCode = 200;
           res.setHeader('Content-Ty[e', 'application/json');
           return res.json({'exists': false, "favourites":favourites})
        }
        else{
            if (favourites.dishes.indexOf(req.params.dishId)<0){
                res.statusCode = 200;
                res.setHeader('Content-Ty[e', 'application/json');
                return res.json({'exists': false, "favourites":favourites})
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Ty[e', 'application/json');
                return res.json({'exists': true, "favourites":favourites})
            }
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOne({name: req.user._id})
    .then((favourite)=>{
        if (!favourite){
            Favourites.create({name: req.user._id})
            .then ((favourite)=>{
                favourite.dishes.push({"_id":req.params.dishId});;
                favourite.save()
              
                })
            }
        
        else if (favourite.dishes.indexOf(req.params.dishId)>=0){
            err = new Error('Dish already in favourites');
            err.status = 403;
            return next(err);
        }
        else{
            favourite.dishes.push(req.params.dishId)
        }
        favourite.save()
        .then((favourite)=>{
            Favourites.findById(favourite._id)
            .populate('name')
            .populate('dishes')
            .then((favourite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favourite);
            }) 
    },(err)=>next(err))
    .catch((err)=>next(err));
})
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /favourites');
})
//must restrict
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOne({name: req.user._id})
    .then((favourite)=>{
        if (favourite!=null){
            if (!favourite.name.equals(req.user._id)){
                err = new Error('You are not authorized to delete this');
                err.status = 403;
                return next(err);
            }
            favourite.dishes.remove(req.params.dishId);
            favourite.save()
            .then((favourite)=>{
                Favourites.findById(favourite._id)
                .populate('name')
                .populate('dishes')
                .then((favourite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                }) 
            }
            ,(err)=>next(err))
            .catch((err)=>next(err));     
        }
        else{
            err = new Error('Dish ' + req.params.dishId +' Not Found');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = favouriteRouter;