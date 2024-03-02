const express = require('express');
const passport = require('passport');
const passportConfig = require('../passport');
const User = require('../models/User');
const JWT = require('jsonwebtoken');


const userRouter = express.Router();

userRouter.post('/register', async(req,res) => {
    const {username,password,role} = req.body
    try{
        const userExists = await User.findOne({username})
        if(userExists) res.status(400).     
        json({message: {msgBody: "Username is already taken", msgError: true}})
        
        await User.create({username,password,role})
        res.status(201).json({message: 
            {msgBody: "Account successfully created", msgError: false}})

    }catch(err){
        console.log(err)
    } 
})

userRouter.post('/login', passport.authenticate('local', {session: false}), (req,res) => {
    if(req.isAuthenticated()){
        const {_id,username,role} = req.user
        const token = signToken(_id)
        res.cookie('access_token', token, {httpOnly: true, sameSite: true})
        res.status(200).json({isAuthenticated: true, user: {username,role}})
    }
})


module.exports = userRouter;