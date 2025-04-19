const express = require('express');
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const app = express();

const SESSION_FILE = './session.json';
const { state, saveState } = useSingleFileAuthState(SESSION_FILE);

app.use(express.static('public'));

let latestQR = null;
let isConnected = false;

app.get('/qr', async (req, res) => {
    const sock = makeWASocket({ auth: state });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;

        if (qr) {
            latestQR = qr;
        }

        if (connection === 'open') {
            console.log('✅ Connected');
            isConnected = true;
            saveState();
        }
    });

    sock.ev.on('creds.update', saveState);

    res.json({ status: 'started' });
});

app.get('/qr-code', async (req, res) => {
    if (latestQR) {
        qrcode.toDataURL(latestQR, (err, src) => {
            res.json({ qr: src });
        });
    } else {
        res.json({ qr: null });
    }
});

app.get('/session', (req, res) => {
    if (fs.existsSync(SESSION_FILE)) {
        res.download(SESSION_FILE, 'session.json');
    } else {
        res.status(404).json({ error: 'Session not generated yet. Please scan QR first.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
