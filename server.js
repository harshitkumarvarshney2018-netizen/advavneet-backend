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
const resend = new Resend(process.env.RESEND_API_KEY);



// This handles the data when someone clicks submit
app.post("/api/book", async (req, res) => {
  const { full_name, phone, email, case_type, preferred_date, description } = req.body;


    
// (res is inside sendMail)
try {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "harshitkumarvarshney2018@gmail.com",
    subject: "New Legal Consultation Request",
    text: `You have received a new consultation request.

Client Details:
Name: ${full_name}
Phone: ${phone}
Email: ${email}

Case Details:
Date Requested: ${preferred_date}
Case Type: ${case_type}
Description: ${description}`
  });

  return res.status(200).json({
    message: "Consultation booked successfully!"
  });

} catch (error) {
  console.error(error);
  return res.status(500).json({
    message: "Email failed"
  });
}
});

app.get("/", (req, res) => {
  res.send("Adv Avneet Kumar Website Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});