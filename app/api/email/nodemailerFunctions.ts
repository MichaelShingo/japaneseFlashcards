import nodemailer from 'nodemailer';

const senderEmail = process.env.SENDER_EMAIL;
const recipientEmail = process.env.RECIPIENT_EMAIL;
const pass = process.env.SENDER_PASSWORD;
export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: senderEmail,
		pass: pass,
	},
});

export const mailOptions = {
	from: senderEmail,
	to: recipientEmail,
};
