require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/book", async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      case_type,
      preferred_date,
      description,
    } = req.body;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "harshitkumarvarshney2018@gmail.com",
      subject: "New Legal Consultation Request",
      text: `
New Legal Consultation Request

Client Details
--------------
Name: ${full_name}
Phone: ${phone}
Email: ${email}

Case Details
------------
Case Type: ${case_type}
Preferred Date: ${preferred_date}
Description: ${description}
`,
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Email failed" });
    }

    console.log("Email sent:", data);

    res.json({
      message: "Consultation booked successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Adv Avneet Kumar Website Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});