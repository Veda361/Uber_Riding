const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceKey = require("./serviceAccountKey.json");

const app = initializeApp({
    credential: cert(serviceKey),
});

const auth = getAuth(app);

module.exports = { auth };