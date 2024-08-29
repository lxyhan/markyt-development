<script>
	export let onClose;
	export let onSubmit;

	let rating;
	let NewEarnings;
	let review;
	let NewPosts;
	const handleSubmit = () => {
		onSubmit({ rating, NewEarnings, review, NewPosts });
		console.log('Trying to close modal'); // Debugging line
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
				<button type="button" on:click={() => handleSubmit()}>
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

			<div class="mt-4">
				<label for="rating" class="block text-sm font-medium text-gray-700">Number of Posts</label>
				<input
					id="rating"
					type="number"
					min="1"
					max="5"
					bind:value={NewPosts}
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
				/>
			</div>

			<div class="mt-4">
				<label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
				<input
					id="rating"
					type="number"
					min="1"
					max="5"
					bind:value={rating}
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
				/>
			</div>

			<div class="mt-4">
				<label for="earnings" class="block text-sm font-medium text-gray-700">Earnings</label>
				<input
					id="earnings"
					type="text"
					bind:value={NewEarnings}
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
				/>
			</div>

			<div class="mt-4">
				<label for="review" class="block text-sm font-medium text-gray-700">Review</label>
				<textarea
					id="review"
					bind:value={review}
					rows="3"
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
				></textarea>
			</div>

			<div class="mt-5 sm:mt-6">
				<button
					type="button"
					class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
					on:click={handleSubmit}
				>
					Submit
				</button>
			</div>
		</div>
	</div>
</div>
