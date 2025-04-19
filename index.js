
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');

// Create a new client instance with LocalAuth for session management
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Generate and display the QR code for authentication
client.on('qr', (qr) => {
    console.log('QR Code received, scan it with your WhatsApp mobile app');
    qrcode.generate(qr, { small: true });
});

// When the client is ready and connected
client.on('ready', () => {
    console.log('Bot is ready and connected to WhatsApp!');
    generatePairCode();
});

// Function to generate a pairing code
function generatePairCode() {
    const pairCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
    console.log(`Pairing code generated: ${pairCode}`);

    // Send the code to the console and ask for the code input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
