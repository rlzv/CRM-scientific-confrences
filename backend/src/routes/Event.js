const express = require('express');
const Event = require('../models/Event');
const passport = require('passport');
const passportConfig = require('../passport');
const User = require('../models/User');
const isAdmin = require("../middlewares/authMiddleware");


const eventsRouter = express.Router();

// Add event - Admin only!
eventsRouter.post('/', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
    try {
      const { title, date, location, description, invites } = req.body;
      console.log(req.body);
  
      // Check if all required fields are provided
      if (!title || !date || !location || !description) {
        return res.status(400).json({ message: { msgBody: 'All fields required' }, msgError: true });
      }
  
      const eventExists = await Event.findOne({ title });
      if (eventExists) {
        return res.status(400).json({ message: { msgBody: 'An event with this name exists', msgError: true } });
      }
  
      await Event.create({ title, date, location, description, invites});
      res.status(201).json({ message: { msgBody: 'Event successfully created', msgError: false } });
    } catch (err) {
      console.log(err);
    }
  });


// Edit event - Admin only!
eventsRouter.put('/:id', passport.authenticate('jwt', {session: false}), isAdmin, async(req, res) => {
    try {
        const { id } = req.params;

        const { title, date, location, description } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(id, {
            title,
            date,
            location,
            description,
        }, { new: true }) 

        res.status(200).json({message: {msgBody: 'Event successfully updated',event: updatedEvent,msgError: false}});

    } catch (err){
        console.log(err);
    }
})


// Delete a event - Admin only!
eventsRouter.delete('/:id', passport.authenticate('jwt', {session: false}), isAdmin, async(req, res) => {
    try{
        const { id } = req.params;
        const exists = await Event.findById(id);
        if(!exists) return res.status(403).json({message: {msgBody: "no event with this id", msgError: true}});

        await Event.findByIdAndDelete(id);
        
        res.status(200).json({message: {msgBody: 'event deleted successfully'}, msgError: false});

    } catch (err) {
        console.log(err);
    }
})


// Delete all events - Admin only!
eventsRouter.delete('/', passport.authenticate('jwt', {session: false}), isAdmin, async(req,res) => {
    try{
        //pentru ca doar adminul poate sa creeze evenimente si ESTE UN SINGUR ADMIN , nu trebuie sa ne complicam cu findById(req.user)
        const events = await Event.find({});
        if (events.length === 0) {
            return res.status(400).json({message: {msgBody: "Don't have any events to delete"}, msgError: true})
        }
        await Event.find({}).deleteMany({});

        res.status(200).json({message: {msgBody: 'All events have been deleted', msgError: false}})

    } catch (err) {
        console.log(err);
    }
})

// Show fields that don't have users in the invites / participants fields
eventsRouter.get('/discover', async(req, res) => {

    const events = await Event.find({$and: [{invites: {$size: 0}},{participants: {$size: 0}}]});

    if (events.length === 0) return res.status(400).json({message: {msgBody: 'No events to discover'}, msgError: true});

    res.status(200).json({message: {msgBody: 'Events discovered!', msgError: false},events});

});

// Show all users that don't appear in invites / participants
eventsRouter.get('/users/:id', async(req, res) => {

    const event = await Event.findById(req.params.id);

    const users = await User.find({
        name: { $nin: [...event.invites, ...event.participants] },
      });

    if (users.length === 0) return res.status(400).json({message: {msgBody: 'No users found'}, msgError: true});

    res.status(200).json({message: {msgBody: 'Events discovered!', msgError: false},users});
    
});

// Show all users that appear in participants
eventsRouter.get('/upcoming', passport.authenticate('jwt', {session: false}), async(req, res) => {
    try{

        const events = await Event.find({participants: req.user.username});
        if (events.length === 0) return res.status(400).json({message: {msgBody: 'Not a participant of any event!'}, msgError: true}, events);

        res.status(200).json({message: {msgBody: 'All events where you are a participant', msgError: false},events});


    } catch (err) {
        console.log(err);
    }
});


// Move the user from invites to participants
eventsRouter.put('/upcoming/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    try{
        const { id } = req.params;
        const event = await Event.findById(id);
        if(!event) return res.status(400).json({message: {msgBody: 'No event with this id'},msgError: true});

        const user = req.user.username;
        const invites = event.invites;

        const participants = event.participants;
        if (participants.includes(user)) return res.status(400).json({message: {msgBody: 'You are part of the event!'}, msgError: true});

        const updatedEvent = await Event.findByIdAndUpdate(id, {
            $pull: {invites: user},
            $push: {participants: user}
        }, {new: true});

        res.status(200).json({message: {msgBody: 'You are now participating to the event!',msgError: false},event: updatedEvent});

    } catch (err){
        console.log(err);
    }
});


// Remove the user from participants
eventsRouter.put('/remove/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    try{
        const {id} = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(400).json({message: {msgBody: 'No event with this id'}, msgError: true});

        const user = req.user.username;
        console.log(user);
        const participant = event.participants;
        if (!participant.includes(user)) return res.status(400).json({message: {msgBody: 'Not a participant to the event!'},msgError: true});

        const updatedEvent = await Event.findByIdAndUpdate(id,{
            $pull: {participants: user}
        }, {new: true});

        res.status(200).json({message: {msgBody: 'You left the event!',msgError: false},event: updatedEvent});

    } catch (err){
        console.log(err);
    }
});

// All events where the user appear in invites field
//
eventsRouter.get('/invites', passport.authenticate('jwt',{session: false}) ,async(req,res) => {
    try {
        
        const events = await Event.find({invites: req.user.username});

        if (events.length === 0) return res.status(400).json({message: {msgBody: 'you are not invited to any event'}, msgError: true});

        res.status(200).json({message: {msgBody: 'all events you are invited to',msgError: false},events});

    } catch (err){
        console.log(err);
    }
})


// Get all events
eventsRouter.get('/', passport.authenticate('jwt', {session: false}), async(req, res) => {
    try {

        if (req.user.role === 'admin' || req.user.role === 'user') {
            const events = await Event.find({});
    
            if (events.length === 0) return res.status(400).json({message: {msgBody: 'no events to get'},msgError: true});
    
            return res.status(200).json({message: {msgBody: 'all events',msgError: false},events});
        }

        return res.status(403).json({message: {msgBody: "not an admin or user, can't get events",msgError: true}});

    }catch(err){
        console.log(err);
    }
})


// Send invites in the app
eventsRouter.post('/invites', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { event, users } = req.body;
  
      const invites = users.filter(user => !event.invites.includes(user) && !event.participants.includes(user));

      // Add all the users from invites to the invites array inside the event
      event.invites.push(...invites);
  
      // Update the event in the database
      await Event.findByIdAndUpdate(event._id, { invites: event.invites });


      console.log(event.invites);
  

      res.status(201).json({ message: { msgBody: 'Event successfully created', msgError: false }});
    } catch (err) {
      console.log(err);
    }
  });

module.exports = eventsRouter;