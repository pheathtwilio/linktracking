import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Twilio from "twilio";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

// Initialize Twilio client
const client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let lastSMSUpdate = null;
let lastLeadTrackingUpdate = null;

app.use((req, res, next) => {
  console.log(`\nIncoming request: ${req.method} ${req.url}`);
  console.log("Body:", req.body);
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Send SMS via Twilio
app.post("/send-sms", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || !/^\+1\d{10}$/.test(phoneNumber)) {
    return res
      .status(400)
      .json({ error: "Invalid phone number format. Must be +1 followed by 10 digits." });
  }

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return res
      .status(500)
      .json({ error: "Twilio credentials not set in environment variables." });
  }

  try {
    const message = await client.messages.create({
      to: phoneNumber,
      messagingServiceSid: "MG3e885279262d2b074f99c57cd894c314", // your Messaging Service SID
      body: "Check out this shortened url https://trackmefortracking.org/N6uAirXeREkpV2MW7kpV2MW7TAvh1zn4gEFMTAvh1zn4gEFMN6uAirXeRE",
      shortenUrls: true,
    });

    console.log("SMS sent:", message.sid);

    lastSMSUpdate = { status: "SMS sent", phoneNumber, sms_sid: message.sid };
    res.json({ message: "SMS sent successfully!", phoneNumber, sms_sid: message.sid });
  } catch (err) {
    console.error("Error sending SMS:", err);
    res.status(500).json({ error: "Failed to send SMS", details: err.message });
  }
});

app.post("/statusEvents", (req, res) => {
  lastSMSUpdate = req.body.MessageStatus || "waiting";
  res.json(lastSMSUpdate);
});

app.get("/updates", (req, res) => {
  console.log(`UPDATE: request ${req.body}`);
  res.json(
    {
      smsStatus: lastSMSUpdate,
      leadTrackingStatus: lastLeadTrackingUpdate,
    });
});

app.post("/clicked", (req, res) => {
  console.log(`Request ${JSON.stringify(req.body)}`);
  lastLeadTrackingUpdate = req.body;
  res.send("You clicked the button!");
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

