const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  service: 'Gmail', // true for 465, false for other ports
  auth: {
    user: 'checker.safiairline@gmail.com', // generated ethereal user
    pass: 'SafiAIrline@123', // generated ethereal password
  },
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // Appears in header & footer of e-mails
    name: 'Marjan',
    link: 'https://github.com/Yusfuu/Management-of-Promotion-Marjane',
    // Optional product logo
    logo: 'https://upload.wikimedia.org/wikipedia/ar/0/00/Marjane.gif'
  }
});

const sendEmail = async (email, link) => {
  const html = {
    body: {
      intro: 'Welcome to Marjan! We\'re very excited to have you on board.',
      action: {
        instructions: 'To get started with Marjan, please click here:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Confirm your account',
          link,
        }
      },
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  };


  const info = await transporter.sendMail({
    from: 'Marjan <checker.safiairline@gmail.com>',
    to: email, // list of receivers
    subject: "Marjan",
    text: "Marjan",
    html: mailGenerator.generate(html),
  });

  return info;
}


module.exports = sendEmail;


