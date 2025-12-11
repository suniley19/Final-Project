const express = require('express');
const dotenv = require('dotenv').config();
const filecontroll = require('./routes/filesRouter');
const usercontroll = require('./routes/userRouter')
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const app = express();

// middleware to connect with mongodb
connectDb();

// required middleware
app.use(express.json())
app.use(express.static('public'));

// user controll routers
app.use('/api',usercontroll)

// file controll routers
app.use('/api', filecontroll)

// error handeling middleware
app.use(errorHandler)

app.listen(5000, () => {
    console.log('server is open at port 5000')
})

