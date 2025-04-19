// index.js
const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const qrcode = require("qrcode");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

let sock;

async function connectToWhatsapp() {
  const { state, saveCreds } = await useMultiFileAuthState("./public");
  sock = makeWASocket({ auth: state });
  
  sock.ev.on("creds.update", saveCreds);
  
  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrcode.toFile("./public/qr.png", qr, () => {
        console.log("QR code updated");
      });
    }
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== 401;
      if (shouldReconnect) {
        connectToWhatsapp();
      }
    } else if (connection === "open") {
      console.log("Connected successfully");
    }
  });
}

connectToWhatsapp();

app.get("/qr", (req, res) => {
  if (fs.existsSync("./public/qr.png")) {
    res.sendFile(__dirname + "/public/qr.png");
  } else {
    res.send("QR not generated yet. Please wait...");
  }
});

app.get("/session", (req, res) => {
  if (fs.existsSync("./public/creds.json")) {
    res.download("./public/creds.json");
  } else {
    res.send("Session not generated yet.");
  }
});

app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});
