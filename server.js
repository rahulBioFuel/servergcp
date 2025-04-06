const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'Password@1234',
    database: process.env.DB_NAME || 'bookmyshow'
});

db.connect(err => {
    if (err) {
        console.error('DB connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.post('/api/events', (req, res) => {
    const { eventName, eventDate, location } = req.body;

    if (!eventName || !eventDate || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO Events (eventName, eventDate, location) VALUES (?, ?, ?)';
    db.query(query, [eventName, eventDate, location], (err, result) => {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Event added', eventId: result.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
