const QRCode = require('qrcode');
const { checkCIDExists, insertTicket, checkTicketExists } = require('../models/ticketModel');

// Generate QR Code
const generateQRCode = async (req, res) => {
    try {
        const qrCodeData = "https://pi-ticket.onrender.com/scan"; //for production
        // const qrCodeData = "http://localhost:3000/scan"; //for local
        const qrCode = await QRCode.toDataURL(qrCodeData);
        res.render('index', { qrCode });
    } catch (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send('Error generating QR code');
    }
};

// Render the CID input page
const scanQRCode = (req, res) => {
    res.render('scan', { errorMessage: null }); // Pass error message if needed
};

// Handle CID form submission and generate ticket
const scanQRCodePost = async (req, res) => {
    const { cid } = req.body;

    // Validate CID (Must be exactly 11 digits)
    if (!/^\d{11}$/.test(cid)) {
        return res.render('scan', { errorMessage: '❌ Invalid CID! It must be exactly 11 digits.' });
    }

    if (await checkCIDExists(cid)) {
        return res.render('scan', { errorMessage: '❌ Ticket already issued for this CID.' });
    }

    let ticketNumber;
    do {
        ticketNumber = 'Pi-' + Math.floor(1000 + Math.random() * 9000); // Generate ticket number
    } while (await checkTicketExists(ticketNumber)); // Ensure uniqueness

    await insertTicket(cid, ticketNumber); // Save to database

    res.render('ticket', { ticketNumber });
};

// Render the ticket download page
const downloadTicket = (req, res) => {
    const ticketNumber = req.query.ticket;
    if (!ticketNumber) {
        return res.status(400).send('No ticket number provided');
    }

    res.render('ticket', { ticketNumber });
};

module.exports = {
    generateQRCode,
    scanQRCode,
    scanQRCodePost,
    downloadTicket
};
