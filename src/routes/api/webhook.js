// src/routes/api/webhooks.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function post({ request }) {
	const sig = request.headers.get('stripe-signature');

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			await request.text(),
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		return {
			status: 400,
			body: `Webhook Error: ${err.message}`
		};
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;
			// Update your database to mark the user as having an active subscription
			break;
		case 'invoice.payment_succeeded':
			const invoice = event.data.object;
			// Update subscription status in your database
			break;
		// ... handle other event types
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	return {
		status: 200,
		body: 'Success'
	};
}
