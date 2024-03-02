const express = require('express');
const passport = require('passport');
const passportConfig = require('../passport');
const User = require('../models/User');
const JWT = require('jsonwebtoken');


const userRouter = express.Router();




module.exports = userRouter;