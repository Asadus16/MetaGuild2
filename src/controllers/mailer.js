const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const senderEmail = "dev.hassuu@gmail.com";

async function sendEmail(recipientEmail, subject, body) {
  const msg = {
    from: senderEmail,
    to: recipientEmail,
    subject,
    text: body,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

const mailSender = async (req, res) => {
  try {
    const { recipient, subject, body } = req.body;

    const info = await sendEmail(recipient, subject, body);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

module.exports = { mailSender };
