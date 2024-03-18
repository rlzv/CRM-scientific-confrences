require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/User');
const cors = require('cors');
const eventsRouter = require('./routes/Event');
const DB_URL = process.env.Atlas_URL;


const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/user',userRouter);
app.use('/events', eventsRouter);   
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


const connect_to_db_and_start_server = async () => {
    try {
        //console.log(DB_URL);
        await mongoose.connect(DB_URL);
        await mongoose.connection.db.admin().command({ ping: 1 });

        console.log('Connected to DB');
        app.listen(5000, () => console.log('Server is running on port 5000'));
    } catch (error) {
        console.log(error);
    }
}

connect_to_db_and_start_server();