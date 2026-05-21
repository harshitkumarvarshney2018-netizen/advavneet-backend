require('dotenv').config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

const nodemailer = require("nodemailer");

// Set up the email sender
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false   // ← THIS was killing it silently
  }
});

// Add this right after — tells you instantly if Gmail works
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail FAILED:", error.message);
  } else {
    console.log("✅ Gmail Ready — emails will send!");
  }
});



// This handles the data when someone clicks submit
app.post("/api/book", (req, res) => {
  const { full_name, phone, email, case_type, preferred_date, description } = req.body;

  const sqlQuery = `INSERT INTO consultations_db (full_name, phone, email, case_type, preferred_date, description) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [full_name, phone, email, case_type, preferred_date, description];

  db.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    const mailOptions = {
        from: "harshitadvdatabase@gmail.com",
        to: "harshitkumarvarshney2018@gmail.com", 
        subject: "New Legal Consultation Request",
        text: `You have received a new consultation request from your website!
        
        Client Details:
        Name: ${full_name}
        Phone: ${phone}
        Email: ${email}
        
        Case Details:
        Date Requested: ${preferred_date}
        Case Type: ${case_type}
        Description: ${description}`
    };

// (res is inside sendMail)
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Email failed:", error.message);
    // Data is already saved in DB, so still return success
    return res.status(200).json({ message: "Consultation booked! (Email failed)" });
  } else {
    console.log("✅ Email sent!", info.messageId);
    return res.status(200).json({ message: "Consultation booked successfully!" });
  }
});          // Closes sendMail  

  });            
});             

app.get("/", (req, res) => {
  res.send("Adv Avneet Kumar Website Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});