import { mailOptions, transporter } from './nodemailerFunctions';

type ContactFormData = {
	firstName: string;
	lastName: string;
	email: string;
	source: string;
	message: string;
};
export async function POST(req: Request) {
	const body: ContactFormData = await req.json();

	if (!body.email || !body.firstName || !body.lastName || !body.message) {
		return new Response('Bad request.', { status: 400 });
	}

	const emailBody: string = `First Name: ${body.firstName}\n\nLast Name: ${body.lastName}\n\nWhere did you find me: ${body.source}\n\nEmail: ${body.email}\n\nMessage: ${body.message}`;

	try {
		await transporter.sendMail({
			...mailOptions,
			subject: 'Violinist Contact Form Submission',
			text: emailBody,
		});
	} catch (e) {
		return new Response(e.message, { status: 400 });
	}
	return new Response('OK', { status: 200 });
}
