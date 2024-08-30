<script>
	export let onClose;
	export let onSubmit;

	let rating;
	let NewEarnings;
	let review;
	let NewPosts;
	let errorMessage = '';

	const handleSubmit = () => {
		if (!rating || !NewEarnings || !review || !NewPosts) {
			errorMessage = 'Please fill out all fields before submitting!';
			return;
		}

		onSubmit({ rating, NewEarnings, review, NewPosts });
		onClose(); // Close the modal after submission
	};
</script>

<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

<div class="fixed inset-0 z-10 overflow-y-auto">
	<div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
		<div
			class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
		>
			<div class="flex justify-between">
				<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
					Complete Campaign
				</h3>
				<!-- Close Button -->
				<button type="button" on:click={onClose()}>
					<span class="sr-only">Close</span>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{#if errorMessage}
				<div class="text-red-500 text-sm mb-4">{errorMessage}</div>
			{/if}

			<div class="mt-4">
				<label for="NewPosts" class="block text-sm font-medium text-gray-700"
					>Number of Posts <span class="text-red-500">*</span></label
				>
				<input
					id="NewPosts"
					type="number"
					min="1"
					bind:value={NewPosts}
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					required
				/>
				<p class="text-xs text-gray-500 mt-1">
					How many glorious posts did you grace the world with?
				</p>
			</div>

			<div class="mt-4">
				<label for="rating" class="block text-sm font-medium text-gray-700"
					>Rating <span class="text-red-500">*</span></label
				>
				<input
					id="rating"
					type="number"
					min="1"
					max="5"
					bind:value={rating}
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					required
				/>
				<p class="text-xs text-gray-500 mt-1">
					On a scale of 1 to 5, how awesome was this campaign?
				</p>
			</div>

			<div class="mt-4">
				<label for="NewEarnings" class="block text-sm font-medium text-gray-700"
					>Earnings <span class="text-red-500">*</span></label
				>
				<input
					id="NewEarnings"
					type="text"
					bind:value={NewEarnings}
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					required
				/>
				<p class="text-xs text-gray-500 mt-1">How much did you earn? Yes, brag a little!</p>
			</div>

			<div class="mt-4">
				<label for="review" class="block text-sm font-medium text-gray-700"
					>Review <span class="text-red-500">*</span></label
				>
				<textarea
					id="review"
					bind:value={review}
					rows="3"
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					required
				></textarea>
				<p class="text-xs text-gray-500 mt-1">
					What did you think? Pour your heart out, but keep it professional... or not.
				</p>
			</div>

			<div class="mt-5 sm:mt-6">
				<button
					type="button"
					class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:text-sm"
					on:click={handleSubmit}
				>
					Submit
				</button>
			</div>
		</div>
	</div>
</div>
