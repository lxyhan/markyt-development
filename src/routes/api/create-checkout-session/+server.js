import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(
	'sk_test_51PtJ32RxmcK87OxOVbJBcUTJhMG0Ufx3tL2vlZRY5P17dgufondnMiljgWFSKACD3QQWKUWPwpjX40RGNyGSHS6900WTtx8HRa'
); // Replace with your Stripe secret key

export async function POST({ request }) {
	try {
		const { priceId } = await request.json();

		if (!priceId) {
			return json({ error: 'Price ID is required' }, { status: 400 });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment', // Switch from 'subscription' to 'payment' for one-time payments
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			success_url: `${request.headers.get('origin')}/success`,
			cancel_url: `${request.headers.get('origin')}/cancel`
		});

		return json({ id: session.id });
	} catch (error) {
		return json({ error: error.message }, { status: 400 });
	}
}
