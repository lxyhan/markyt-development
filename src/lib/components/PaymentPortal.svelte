<script>
	export let onClose;
	export let onSubscribe;

	const handleSubscribeClick = () => {
		onSubscribe();
		onClose();
	};
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
	<div class="bg-white rounded-lg overflow-hidden shadow-lg w-96 z-50">
		<div class="px-6 py-4">
			<h2 class="text-xl font-semibold text-gray-800">Access Restricted</h2>
			<p class="mt-4 text-gray-600">
				To access this feature, you need to have an active subscription. Please go to the payment
				page to subscribe.
			</p>
		</div>
		<div class="px-6 py-4 bg-gray-100 text-right">
			<button
				class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
				on:click={onClose}
			>
				Close
			</button>
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
				on:click={handleSubscribeClick}
			>
				Go to Payment Page
			</button>
		</div>
	</div>
</div>
