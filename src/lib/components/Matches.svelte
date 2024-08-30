<script>
	import { onMount } from 'svelte';
	import { authStateListener } from '$lib/auth.js';
	import { getMatches, createMatches, getUserInfo, getInfluencerMatches } from '$lib/firestore.js'; // Adjust paths as needed
	import { userInfo } from '$lib/userStore.js';
	import { goto } from '$app/navigation';

	let matches = [];
	let loading = true;
	export let openPaymentModal;

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
			console.log(matches);
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

	// Function to calculate the average rating from an array of ratings
	function calculateAverageRating(ratings) {
		if (!ratings || ratings.length === 0) return 0;
		const total = ratings.reduce((sum, rating) => sum + rating, 0);
		return total / ratings.length;
	}

	// Function to calculate the star percentage based on the average rating
	function getStarPercentage(average) {
		return (average / 5) * 100;
	}

	console.log($userInfo.subscriptionActive);
</script>

{#if loading}
	<ul role="list" class="divide-y divide-gray-100 pl-10">
		{#each Array(5).fill(0) as _, i}
			<li class="flex gap-x-6 py-5">
				<div class="flex items-center gap-4">
					<div class="skeleton h-12 w-12 rounded-full"></div>
				</div>
				<div class="flex-1">
					<div class="skeleton h-6 w-3/4 mb-2"></div>
					<div class="skeleton h-4 w-1/2 mb-2"></div>
					<div class="skeleton h-4 w-1/4"></div>
				</div>
			</li>
		{/each}
	</ul>
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
			{#each matches as match, i}
				<li class="flex flex-col gap-x-6 py-5">
					{#if $userInfo.subscriptionActive}
						<a
							href={`/users/${match.id}`}
							class="flex min-w-0 gap-x-4 flex-1 items-center hover:bg-gray-50 p-2 rounded-md"
						>
							<!-- Content here remains the same -->
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								src={match.profilePicture ||
									'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
								alt={match.name}
							/>
							<div class="min-w-0 flex-auto">
								<p class="text font-semibold leading-6 text-gray-900">{match.name}</p>
								<p class="mt-1 truncate text-sm leading-5 text-gray-500">{match.email}</p>

								<div class="mt-2 text-xs text-gray-500 space-y-1">
									{#if $userInfo.userType == 'business'}
										<p>Posts: <span class="text-gray-900">{match.numPosts || 0}</span></p>
									{/if}
									<p>
										Reviews: <span class="text-gray-900">
											{(match.reviews || []).length > 0 ? match.reviews.length : 'No reviews'}
										</span>
									</p>
									<div class="flex items-center">
										<p>
											Rating: <span class="text-gray-900"
												>{calculateAverageRating(match.ratings || []).toFixed(1)}</span
											>
										</p>
										<div class="stars-outer ml-2">
											<div
												class="stars-inner"
												style="width: {getStarPercentage(
													calculateAverageRating(match.ratings || [])
												)}%"
											></div>
										</div>
									</div>
								</div>
							</div>
							<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
								<p class="text-sm leading-6 text-gray-900">
									{$userInfo.userType === 'influencer' ? 'Business' : 'Influencer'}
								</p>
								<p class="mt-1 text-xs leading-5 text-gray-500">{match.city}, {match.province}</p>
							</div>
						</a>
					{:else}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<a
							on:click={openPaymentModal}
							class="flex min-w-0 gap-x-4 flex-1 items-center hover:bg-gray-50 p-2 rounded-md"
						>
							<!-- Content here remains the same -->
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								src={match.profilePicture ||
									'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
								alt={match.name}
							/>
							<div class="min-w-0 flex-auto">
								<p class="text font-semibold leading-6 text-gray-900">{match.name}</p>
								<p class="mt-1 truncate text-sm leading-5 text-gray-500">{match.email}</p>

								<div class="mt-2 text-xs text-gray-500 space-y-1">
									{#if $userInfo.userType == 'business'}
										<p>Posts: <span class="text-gray-900">{match.numPosts || 0}</span></p>
									{/if}
									<p>
										Reviews: <span class="text-gray-900">
											{(match.reviews || []).length > 0 ? match.reviews.length : 'No reviews'}
										</span>
									</p>
									<div class="flex items-center">
										<p>
											Rating: <span class="text-gray-900"
												>{calculateAverageRating(match.ratings || []).toFixed(1)}</span
											>
										</p>
										<div class="stars-outer ml-2">
											<div
												class="stars-inner"
												style="width: {getStarPercentage(
													calculateAverageRating(match.ratings || [])
												)}%"
											></div>
										</div>
									</div>
								</div>
							</div>
							<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
								<p class="text-sm leading-6 text-gray-900">
									{$userInfo.userType === 'influencer' ? 'Business' : 'Influencer'}
								</p>
								<p class="mt-1 text-xs leading-5 text-gray-500">{match.city}, {match.province}</p>
							</div>
						</a>
					{/if}

					<!-- Dropdown for Reviews -->
					<div class="mt-2">
						<button
							type="button"
							class="text-blue-600 text-xs"
							on:click={() => document.getElementById(`reviews-${i}`).classList.toggle('hidden')}
						>
							View Reviews
						</button>

						<ul id={`reviews-${i}`} class="hidden mt-2 space-y-2">
							{#each match.reviews || [] as review}
								<li class="text-xs text-gray-600 bg-gray-100 p-2 rounded-md">
									{review.review} - Review from {review.reviewerEmail}
								</li>
							{/each}

							{#if (match.reviews || []).length === 0}
								<li class="text-xs text-gray-500">No reviews available.</li>
							{/if}
						</ul>
					</div>
				</li>
			{/each}
		</ul>

		{#if matches.length === 0}
			<p class="pl-2">No matches available as of this time. Check back later!</p>
		{/if}
	</div>
{/if}
