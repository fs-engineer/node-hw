import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { handleError } from '../../lib/handlerror.js';

dotenv.config();

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'ura_tormoz@meta.ua',
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

function sendVerifyMail(email, verifyToken) {
  const emailOptions = {
    from: 'ura_tormoz@meta.ua',
    to: email,
    subject: 'Verify mail',
    text: `Please verify your email http://localhost:3000/users/verify/${verifyToken}`,
  };

  transporter
    .sendMail(emailOptions)
    .then(info => console.log(info))
    .catch(err => console.log(err));
}

export default sendVerifyMail;
