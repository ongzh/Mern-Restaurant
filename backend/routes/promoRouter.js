const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const Promotions = require('../models/promotions');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//means declare endpoint of single location
//chain all get/put/post/delete into here
promoRouter.route('/')
.options(cors.corsWithOptions, (req, res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Promotions.find(req.query)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log('promotion Created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /Promotions');
})
//must restrict
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

promoRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req, res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode= 403;
    res.end('POST operations not supported on /Promotions/'
     + req.params.promotionId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
   Promotions.findOneAndUpdate(req.params.promotionId,{
       $set: req.body
   },{new: true})
   .then((promotion)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})//must restrict
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.deleteOne(req.params.promotionId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});



module.exports = promoRouter;