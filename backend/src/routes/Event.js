const express = require('expres');
const Event = require('../models/Event');
const passport = require('passport');
const passportConfiguration = require('../passport');

const eventsRouter = express.Router();

// Create an event
eventsRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// Update an event
eventsRouter.put('/:eventId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { eventId } = req.params;
    const { title, date, location, description, invites } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(eventId, { title, date, location, description, invites }, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating the event." });
    }
});

// Delete an event
eventsRouter.delete('/:eventId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting the event." });
    }
});

// List all events
eventsRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving events." });
    }
});

module.exports = eventsRouter;