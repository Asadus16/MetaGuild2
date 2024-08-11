const sgMail = require("@sendgrid/mail");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const mailSender = async (req, res) => {
  try {
    const { recipient, subject, body } = req.body;
    const sentFrom = new Sender(
      "sender@trial-pr9084znxrj4w63d.mlsender.net",
      "MetaGuild"
    );

    const recipients = [new Recipient(recipient, "MetaUser")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(body)
      .setText("This is the text content");

    await mailerSend.email.send(emailParams);

    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: error });
  }
};

module.exports = { mailSender };
