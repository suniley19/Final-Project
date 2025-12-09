require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');


const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));


// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/files'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));