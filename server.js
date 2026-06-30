require('dotenv').config();

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("REJECTION:", err);
});

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const { Resend } = require("resend");


// This handles the data when someone clicks submit
app.post("/api/book", async (req, res) => {
  const { full_name, phone, email, case_type, preferred_date, description } = req.body;

  console.log("New booking request:", { full_name, phone, email, case_type, preferred_date, description });

  return res.status(200).json({
    message: "Consultation booked successfully!"
  });
});

app.get("/", (req, res) => {
  res.send("Adv Avneet Kumar Website Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});