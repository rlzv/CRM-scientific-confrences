const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const DB_URL = process.env.Atlas_URL;

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser());
app.use(express.json());

const connect_to_db_and_start_server = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Connected to DB');
        app.listen(5000, () => console.log('Server is running on port 5000'));
    } catch (error){
        console.log(error);
    }
}

connect_to_db_and_start_server()