const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = "d1c746e5dc56a5dc017504a2aeddead4";

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "EmergencyAlerts@demomailtrap.com",
  name: "Click Block Tech Alert",
};
const recipients = [
  "clickblocktech@gmail.com",
];

const alertEmailService = (location) =>{
    transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "Emergency Alert button Triggered",
    text: `Emergency alert is triggered at:
     ${location}`,
    category: "Emergency Alert",
  })
  .then(console.log, console.error);
}
module.exports = {alertEmailService};