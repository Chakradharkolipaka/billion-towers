// const nodeMailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");
let sendGridEnabled = false;
if (
  typeof process.env.SENDGRID_API_KEY === "string" &&
  process.env.SENDGRID_API_KEY.startsWith("SG.")
) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sendGridEnabled = true;
} else {
  // console.warn("SendGrid API key is not configured or invalid. Email sending is disabled.");
}

const sendEmail = async (options) => {
  if (!sendGridEnabled) {
    console.warn("Skipping email send because SendGrid is not configured.");
    return;
  }

  // const transporter = nodeMailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     service: process.env.SMTP_SERVICE,
  //     auth: {
  //         user: process.env.SMTP_MAIL,
  //         pass: process.env.SMTP_PASSWORD,
  //     },
  // });

  // const mailOptions = {
  //     from: process.env.SMTP_MAIL,
  //     to: options.email,
  //     subject: options.subject,
  //     html: options.message,
  // };

  // await transporter.sendMail(mailOptions);

  const msg = {
    to: options.email,
    from: process.env.SENDGRID_MAIL,
    templateId: options.templateId,
    dynamic_template_data: options.data,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email Sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
