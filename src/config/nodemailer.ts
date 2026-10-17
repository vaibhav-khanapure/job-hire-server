import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import nodemailer from 'nodemailer';
import ENV from '../constants/ENV.js';

const options: SMTPTransport.Options = {
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: false,
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: ENV.EMAIL_TLS ? true : false,
    },
};

const transporter = nodemailer.createTransport(options);

export default transporter;