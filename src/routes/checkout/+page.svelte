<!-- src/routes/pay.svelte -->
<script>
	import { loadStripe } from '@stripe/stripe-js';
	let stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

	async function handleCheckout() {
		const response = await fetch('/api/create-checkout-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				priceId: 'price_1PtJ5dRxmcK87OxOLYNy6DZL' // Replace with your actual Stripe price ID
			})
		});

		const data = await response.json();

		if (data.error) {
			console.error('Error creating checkout session:', data.error);
			return;
		}

		const stripe = await stripePromise;
		const { error } = await stripe.redirectToCheckout({ sessionId: data.id });

		if (error) {
			console.error('Stripe checkout error:', error);
		}
	}
</script>

<button on:click={handleCheckout}> Subscribe Now </button>
