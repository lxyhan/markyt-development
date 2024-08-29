<script>
	import { onMount } from 'svelte';
	import { authStateListener } from '$lib/auth.js';
	import { getMatches, createMatches, getUserInfo, getInfluencerMatches } from '$lib/firestore.js'; // Adjust paths as needed
	import { userInfo } from '$lib/userStore.js';
	import { goto } from '$app/navigation';

	let matches = [];
	let loading = true;

	// Function to fetch or create matches
	const handleMatches = async () => {
		try {
			if ($userInfo.userType === 'business') {
				// Check if matches exist
				matches = await getMatches($userInfo.uid);

				// If no matches exist, create them
				if (matches.length === 0) {
					matches = await createMatches($userInfo.uid);
				}
			} else if ($userInfo.userType === 'influencer') {
				// Just fetch matches if user is an influencer
				const businessMatches = await getInfluencerMatches($userInfo.uid);

				// Filter businesses that have the influencer in their matches
				matches = businessMatches;
			}

			if (matches.length === 0) {
				console.log('No matches found');
			} else {
				// console.log('Fetched/Created Matches:', matches);
			}
		} catch (error) {
			console.error('Error handling matches:', error);
		} finally {
			loading = false;
		}
	};

	onMount(async () => {
		authStateListener(async (user) => {
			if (user) {
				try {
					// Fetch user data and update store
					const fetchedUserInfo = await getUserInfo(user.uid);
					userInfo.set({
						...fetchedUserInfo,
						uid: user.uid,
						email: user.email
					});

					await handleMatches(); // Handle fetching or creating matches
				} catch (error) {
					console.error('Error fetching user info or handling matches:', error);
				} finally {
					loading = false;
				}
			} else {
				// Handle user not authenticated (e.g., redirect to login)
				goto('/login');
			}
		});
	});
</script>

{#if loading}
	<p>Loading matches...</p>
{:else}
	<div class="pl-10">
		<div class="indicator flex items-center">
			<h2 class="text-lg font-semibold leading-7 text-gray-900 mb-0 ml-2">
				{matches.length} Matched {$userInfo.userType === 'influencer'
					? 'Businesses'
					: 'Influencers'}
			</h2>
		</div>

		<ul role="list" class="divide-y divide-gray-100">
			{#each matches as match}
				<li class="flex justify-between gap-x-6 py-5">
					<a
						href={`/users/${match.id}`}
						class="flex min-w-0 gap-x-4 flex-1 items-center hover:bg-gray-50 p-2 rounded-md"
					>
						<img
							class="h-12 w-12 flex-none rounded-full bg-gray-50"
							src={match.profilePicture ||
								'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
							alt={match.name}
						/>
						<div class="min-w-0 flex-auto">
							<p class="text-sm font-semibold leading-6 text-gray-900">{match.name}</p>
							<p class="mt-1 truncate text-xs leading-5 text-gray-500">{match.email}</p>
						</div>
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="text-sm leading-6 text-gray-900">
								{$userInfo.userType === 'influencer' ? 'Business' : 'Influencer'}
							</p>
							<p class="mt-1 text-xs leading-5 text-gray-500">
								{match.city}, {match.province}
							</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>

		{#if matches.length === 0}
			<p>No matches available.</p>
		{/if}
	</div>
{/if}
