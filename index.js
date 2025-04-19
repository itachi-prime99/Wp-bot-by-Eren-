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
let socketStarted = false;

async function startSock() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;

        if (qr) {
            latestQR = qr;
            console.log('QR Updated');
        }

        if (connection === 'open') {
            console.log('✅ WhatsApp connected!');
            isConnected = true;
            saveState();
        }

        if (connection === 'close') {
            const shouldReconnect = (update.lastDisconnect.error = Boom)?.output?.statusCode !== 401;
            console.log('connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) startSock();
        }
    });

    sock.ev.on('creds.update', saveState);
}

// API: Start socket and generate QR
app.get('/qr', async (req, res) => {
    if (!socketStarted) {
        await startSock();
        socketStarted = true;
    }
    res.json({ status: 'starting socket' });
});

// API: Serve QR as base64 image
app.get('/qr-code', async (req, res) => {
    if (latestQR) {
        qrcode.toDataURL(latestQR, (err, url) => {
            if (err) return res.status(500).json({ error: 'QR generation failed' });
            res.json({ qr: url });
        });
    } else {
        res.json({ qr: null });
    }
});

// API: Download session file
app.get('/session', (req, res) => {
    if (fs.existsSync(SESSION_FILE)) {
        res.download(SESSION_FILE, 'session.json');
    } else {
        res.status(404).json({ error: 'Session not generated yet. Please scan QR first.' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
