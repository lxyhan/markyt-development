<script>
	import { onMount } from 'svelte';
	import { authStateListener } from '$lib/auth.js';
	import { userInfo, loading } from '$lib/userStore.js';
	import { getUserInfo } from '$lib/firestore.js';
	import ProfileEditor from '../../lib/components/ProfileEditor.svelte';
	import ConnectedSocialMedia from '../../lib/components/ConnectedSocialMedia.svelte';
	import BusinessProfileEditor from '../../lib/components/BusinessProfileEditor.svelte';
	import Matches from '../../lib/components/Matches.svelte';
	import Analytics from '../../lib/components/Analytics.svelte';
	import PaymentPortal from '../../lib/components/PaymentPortal.svelte';

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
						email: user.email
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
</script>

{#if $loading}
	<div class="flex justify-center items-center h-screen">
		<span class="loading loading-spinner loading-xl text-emerald-600"></span>
	</div>
{:else}
	<main class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Shared component for both user types -->
		<div class="col-span-1 md:col-span-2">
			{#if $userInfo.userType === 'business'}
				<BusinessProfileEditor />
			{:else if $userInfo.userType === 'influencer'}
				<ProfileEditor />
			{/if}
		</div>
		{#if $userInfo.profileComplete === true}
			<!-- Conditional components based on user type -->
			<div class="col-span-1">
				<Matches></Matches>
			</div>

			<!-- Shared component for both user types -->
			<div class="col-span-1 lg:col-start-2 lg:col-span-1 p-4 max-w-full lg:max-w-[90%]">
				<Analytics />
			</div>
		{/if}
	</main>
{/if}
