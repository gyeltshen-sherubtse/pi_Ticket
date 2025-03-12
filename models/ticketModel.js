const { Client } = require('pg');
require("dotenv").config();

// Database configuration
const client = new Client({
    // connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false }, 
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Required for Render PostgreSQL
});

client.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ PostgreSQL Connection Error:", err));

const checkCIDExists = async (cid) => {
    const query = 'SELECT * FROM piday_ticket WHERE cid = $1';
    const result = await client.query(query, [cid]);
    return result.rows.length > 0;
};

const checkTicketExists = async (ticketNumber) => {
    const result = await client.query('SELECT * FROM piday_ticket WHERE ticket_number = $1', [ticketNumber]);
    return result.rowCount > 0;
};

const insertTicket = async (cid, ticketNumber) => {
    const query = 'INSERT INTO piday_ticket (cid, ticket_number) VALUES ($1, $2)';
    await client.query(query, [cid, ticketNumber]);
};

module.exports = { checkCIDExists, insertTicket, checkTicketExists };
