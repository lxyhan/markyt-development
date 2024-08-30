<script>
	import { onMount } from 'svelte';
	import { authStateListener } from '$lib/auth.js';
	import { userInfo, loading } from '$lib/userStore.js';
	import { getUserInfo } from '$lib/firestore.js';
	import { goto } from '$app/navigation.js';
	import ProfileEditor from '../../lib/components/ProfileEditor.svelte';
	import ConnectedSocialMedia from '../../lib/components/ConnectedSocialMedia.svelte';
	import BusinessProfileEditor from '../../lib/components/BusinessProfileEditor.svelte';
	import Matches from '../../lib/components/Matches.svelte';
	import Analytics from '../../lib/components/Analytics.svelte';
	import PaymentPortal from '../../lib/components/PaymentPortal.svelte';

	let showPaywallModal = false;

	// Fetch user information on mount
	onMount(() => {
		authStateListener(async (user) => {
			if (user) {
				try {
					// Fetch user data and update store
					const fetchedUserInfo = await getUserInfo(user.uid); // Assuming you have a function to fetch user info
					userInfo.set({
						...fetchedUserInfo,
						uid: user.uid,
						email: user.email,
						earnings: fetchedUserInfo.earnings,
						earningsHistory: fetchedUserInfo.earningsHistory,
						numPosts: fetchedUserInfo.numPosts,
						postsHistory: fetchedUserInfo.postsHistory,
						ratings: fetchedUserInfo.ratings,
						reviews: fetchedUserInfo.reviews
					});
					// console.log('User Type:', $userInfo);
				} catch (error) {
					console.error('Error fetching user info:', error);
				} finally {
					$loading = false; // Set loading to false after data is fetched
				}
			} else {
				// Handle user not authenticated (e.g., redirect to login)
				goto('/login');
			}
		});
	});
	console.log('User Info:', $userInfo);

	const openPaymentModal = () => {
		console.log($userInfo);
		if ($userInfo.userType === 'business' && !$userInfo.subscriptionActive) {
			// If the user is a business and not subscribed, show the paywall modal
			showPaywallModal = true;
		}
	};

	function onClose() {
		showPaywallModal = false;
		console.log('clicked');
	}

	function onSubscribe() {
		goto('/checkout');
	}
</script>

{#if $loading}
	<div class="flex justify-center items-center h-screen">
		<span class="loading loading-spinner loading-xl text-emerald-600"></span>
	</div>
{:else}
	{#if showPaywallModal}
		<PaymentPortal {onClose} {onSubscribe}></PaymentPortal>
	{/if}
	<main class="grid grid-cols-1 md:grid-cols-7 gap-6">
		<!-- Shared component for both user types -->
		<div class="col-span-7 pr-10">
			{#if $userInfo.userType === 'business'}
				<BusinessProfileEditor />
			{:else if $userInfo.userType === 'influencer'}
				<ProfileEditor />
			{/if}
		</div>

		{#if $userInfo.profileComplete === true}
			<!-- Matches Component taking up 2 out of 6 columns -->
			<div class="col-span-6 md:col-span-3">
				<Matches {openPaymentModal}></Matches>
			</div>

			<!-- Analytics Component taking up 4 out of 6 columns -->
			<div class="col-span-6 md:col-span-4 pr-20 pl-10 max-w-full">
				<Analytics />
			</div>
		{/if}
	</main>
{/if}
