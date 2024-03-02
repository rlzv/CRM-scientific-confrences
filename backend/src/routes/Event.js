const express = require('expres');
const Event = require('../models/Event');
const Group = require('../models/User');
const passport = require('passport');
const passportConfiguration = require('../passport');

const eventsRouter = express.Router();