<script>
	import { loadStripe } from '@stripe/stripe-js';
	import { userInfo } from '$lib/userStore';
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

<section id="checkout" class="py-12 sm:py-12">
	<div class="bg-white">
		<header class="absolute inset-x-0 top-0 z-50">
			<nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
				<div class="flex lg:flex-1">
					<a href="#checkout" class="-m-1.5 p-1.5">
						<span class="sr-only">Markyt</span>
						<img class="h-8 w-auto" src="/MarkytIcon.png" alt="Markyt Logo" />
					</a>
				</div>
				<div class="hidden lg:flex lg:gap-x-12"></div>
				<div class="hidden lg:flex lg:flex-1 lg:justify-end">
					<a class="text-sm font-semibold leading-6 text-gray-900"
						>Log in as <span aria-hidden="true">{$userInfo.email}</span></a
					>
				</div>
			</nav>
		</header>

		<div class="relative isolate px-6 pt-14 lg:px-8">
			<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
				<div class="text-center">
					<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
						One Time Purchase: $35 CAD
					</h1>
					<p class="mt-6 text-lg leading-8 text-gray-600">
						Access all your matches and influencers.
					</p>
					<div class="mt-10 flex items-center justify-center gap-x-6">
						<button
							on:click={handleCheckout}
							class="rounded-md bg-[#0A7E6A] px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-[#52AF7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A7E6A]"
						>
							Subscribe Now
						</button>
					</div>
				</div>
			</div>

			<div
				class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
				aria-hidden="true"
			>
				<div
					class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
					style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
				></div>
			</div>
		</div>
	</div>
</section>
