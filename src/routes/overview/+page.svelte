<script>
	import { authStateListener } from '$lib/auth.js';
	import { getUserInfo } from '$lib/firestore.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation'; // Import the goto function for navigation
	import Profilecard from '../../lib/components/Profilecard.svelte';

	let userProfile;
	let isBusiness = false;

	onMount(() => {
		authStateListener(async (user) => {
			if (user) {
				console.log('User is authenticated:', user);
				const userInfo = await getUserInfo(user.uid);
				console.log('Retrieved user info:', userInfo);
				userProfile = userInfo;
				isBusiness = userProfile.userType === 'business'; // Set isBusiness after userProfile is set
				console.log('isBusiness:', isBusiness);
			} else {
				console.log('User is not authenticated');
			}
		});
	});

	// Utility functions to calculate ratings
	function calculateAverageRating(ratings) {
		if (!ratings || ratings.length === 0) return 0;
		const total = ratings.reduce((sum, rating) => sum + rating, 0);
		return total / ratings.length;
	}

	function getStarPercentage(average) {
		return (average / 5) * 100;
	}

	function returnToDashboard() {
		goto('/users');
	}

	console.log(userProfile);
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100 relative">
	<div class="mockup-phone">
		<div class="camera"></div>
		<div class="display bg-white flex flex-col justify-between p-4">
			{#if userProfile}
				<!-- Render the Profilecard component only if userProfile is defined -->
				<Profilecard {userProfile} {isBusiness} />
			{:else}
				<!-- Optionally, you can show a loading spinner or message while the user profile is being fetched -->
				<p>Loading user profile...</p>
			{/if}
		</div>
	</div>

	<!-- Position the button outside the phone in the bottom right corner -->
	<button
		on:click={returnToDashboard}
		type="button"
		class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 absolute top-4 right-4"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="w-5 h-5 mr-2"
		>
			<path
				fill-rule="evenodd"
				d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
				clip-rule="evenodd"
			/>
		</svg>
		Return to Dashboard
	</button>
</div>

<style>
	.mockup-phone {
		width: 500px;
		height: 720px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.mockup-phone .display {
		width: 100%;
		height: 100%;
		border-radius: 32px;
		overflow: hidden;
		padding: 16px; /* Add padding to ensure content does not touch edges */
	}

	.stars-outer {
		display: inline-block;
		position: relative;
		font-family: 'Arial', sans-serif;
		color: #d3d3d3; /* Unlit stars color */
		font-size: 1.25rem; /* Smaller star size */
	}

	.stars-inner {
		position: absolute;
		top: 0;
		left: 0;
		white-space: nowrap;
		overflow: hidden;
		width: 0; /* This will be set dynamically */
		color: #ffc107; /* Lit stars color */
	}

	.stars-inner::before {
		content: '★★★★★'; /* Five stars */
	}

	.stars-outer::before {
		content: '★★★★★'; /* Five stars */
	}
</style>
