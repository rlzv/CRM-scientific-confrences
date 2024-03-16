const express = require('express');
const passport = require('passport');
const passportConfig = require('../passport');
const User = require('../models/User');
const JWT = require('jsonwebtoken');


const userRouter = express.Router();

const signToken = userID => {
    return JWT.sign({
        iss: 'robi',
        sub: userID,
    }, 'secret', {expiresIn: "1d"})
}

userRouter.post('/register', async(req,res) => {
    const {username,password,role} = req.body;
    try {
        const userExists = await User.findOne({username});
        if(userExists) {
            return res.status(400).json({message: {msgBody: "Username is already taken", msgError: true}});
        }
        
        const newUser = new User({username, password, role});
        const savedUser = await newUser.save(); // Explicitly save the user to handle the promise
        
        // Only send a success response after confirming the user is saved
        if (savedUser) {
            console.log("Saved user is", savedUser);
            res.status(201).json({message: {msgBody: "Account successfully created", msgError: false}});
        } else {
            // In case save operation was unsuccessful without throwing an error
            throw new Error('User creation failed for an unknown reason.');
        }
    } catch(err) {
        console.error(err); // Log the error to the server's console
        res.status(500).json({message: {msgBody: "An error occurred during registration", msgError: true}});
    } 
});

userRouter.post('/login', passport.authenticate('local', {session: false}), (req,res) => {
    if(req.isAuthenticated()){
        const {_id,username,role} = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        res.status(200).json({isAuthenticated: true, user: {username,role}});
    }
});

userRouter.get('/logout', passport.authenticate('jwt', {session: false}), (req,res) => {
    res.clearCookie('access_token');
    res.json({user: {username: "", role: ""}, success: true});
});


userRouter.get('/admin', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (req.user.role === 'admin') {
        res.status(200).json({isAdmin: true});
    } else {
        res.status(201).json({message: {msgBody: "Sorry, you are not an organizer!", msgError: true}});
    }
});

userRouter.get('/authenticated', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (req.isAuthenticated()) {
        const {username,role} = req.user;
        res.status(200).json({isAuthenticated: true, user: {username, role}});
    }
});




userRouter.get('/', passport.authenticate('jwt', {session: false}), async(req, res) => {
        try {

            const users = await User.find({});
            
            if (users.length === 0) {
                return res.status(404).json({message: {msgBody: "No users found", msgError: true}});
            }

            res.status(200).json({users});

        } catch (err) {
            console.log(err);
        }
});


module.exports = userRouter;