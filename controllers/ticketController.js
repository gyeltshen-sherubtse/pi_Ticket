// controllers/ticketController.js

const QRCode = require('qrcode');
const { checkCIDExists, insertTicket } = require('../models/ticketModel');

// Generate QR Code
const generateQRCode = async (req, res) => {
    try {
        const qrCodeData = "https://pi-ticket.onrender.com/scan"; // URL for scanning
        const qrCode = await QRCode.toDataURL(qrCodeData);
        res.render('index', { qrCode });
    } catch (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send('Error generating QR code');
    }
};

// Render the CID input page
const scanQRCode = (req, res) => {
    res.render('scan'); // Render the CID input form
};

// Handle CID form submission and generate ticket
const scanQRCodePost = async (req, res) => {
    const { cid } = req.body;

    if (await checkCIDExists(cid)) {
        return res.status(400).send('Ticket already issued for this CID');
    }

    const ticketNumber = '314' + Math.floor(1000 + Math.random() * 9000);
    await insertTicket(cid, ticketNumber);

    res.send(`
        <h1>Your ticket number is ${ticketNumber}</h1>
        <a href="/download-ticket?ticket=${ticketNumber}" download>Download Ticket</a>
    `);
};

// Handle ticket download
const downloadTicket = (req, res) => {
    const ticketNumber = req.query.ticket;
    if (!ticketNumber) {
        return res.status(400).send('No ticket number provided');
    }

    res.send(`
        <h1>Your ticket number: ${ticketNumber}</h1>
        <p>Download or screenshot this ticket.</p>
    `);
};

module.exports = {
    generateQRCode,
    scanQRCode,
    scanQRCodePost,
    downloadTicket
};
