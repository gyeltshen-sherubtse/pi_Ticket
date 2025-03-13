// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require("dotenv")

// Importing the controller functions
const { generateQRCode, scanQRCode, scanQRCodePost, downloadTicket } = require('./controllers/ticketController');

//load environment variables
dotenv.config();

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/views'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Define routes with their respective controller functions
// app.get('/', generateQRCode); // Generate the QR Code page
app.get('/scan', scanQRCode); // Render the CID input form
app.post('/scan', scanQRCodePost); // Handle CID form submission and ticket generation
app.get('/download-ticket', downloadTicket); // Handle ticket download

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;