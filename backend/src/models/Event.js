const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {type: String, required: true,unique: [true, 'An event with this name already exists!'] },
    date: {type: Date, required: true},
    location: {type: String, required: true},
    speaker: {type: String, required: true},
    description: {type: String, required: true},
    invites: [String],
    participants: [String],
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;