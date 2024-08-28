<script>
	import { onMount } from 'svelte';
	import { getInfluencers } from '$lib/firestore.js'; // Adjust the path as needed

	let influencers = [];

	onMount(async () => {
		try {
			// Fetch influencers with desired filters
			const filters = {
				// niche: 'fitness', // Example filter for niche
				// minFollowers: 10000, // Example filter for minimum followers
				// location: 'New York' // Example filter for location
			};

			influencers = await getInfluencers(filters);
			console.log('Filtered Influencers:', influencers);
		} catch (error) {
			console.error('Error fetching influencers:', error);
		}
	});
</script>

<div class="pl-10">
	<h2 class="text-lg font-semibold leading-7 text-gray-900 mb-0">Matched Influencers</h2>
	<ul role="list" class="divide-y divide-gray-100">
		{#each influencers as influencer}
			<li class="flex justify-between gap-x-6 py-5">
				<a
					href="#"
					class="flex min-w-0 gap-x-4 flex-1 items-center hover:bg-gray-50 p-2 rounded-md"
				>
					<img
						class="h-12 w-12 flex-none rounded-full bg-gray-50"
						src={influencer.profilePicture ||
							'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
						alt={influencer.name}
					/>
					<div class="min-w-0 flex-auto">
						<p class="text-sm font-semibold leading-6 text-gray-900">{influencer.name}</p>
						<p class="mt-1 truncate text-xs leading-5 text-gray-500">{influencer.email}</p>
					</div>
					<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
						<p class="text-sm leading-6 text-gray-900">{influencer.title || 'Influencer'}</p>
						<p class="mt-1 text-xs leading-5 text-gray-500">
							Last seen <time datetime="2023-01-23T13:23Z">3h ago</time>
						</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>
