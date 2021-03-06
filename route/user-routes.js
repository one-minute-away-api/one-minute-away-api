'use strict';

const express = require('express');
const User = require('../model/user');
const jwtAuth = require('../lib/jwt');

const userRouter = module.exports = exports = express.Router();

userRouter.get('/:id/', jwtAuth, (req, res, next) => {
  User.findOne({_id: req.params.id}, (err, user) => {
    user.password = null;
    if (err || !user) return next(err);
    res.json(user);
  });
});

userRouter.delete('/:id', jwtAuth, (req, res, next) => {
  let _id = req.params.id;
  User.findOneAndRemove({_id}, (err, user) => {
    if(err || !user) return next(err);
    let message = 'successfully deleted';
    res.json({message});
  });
});
