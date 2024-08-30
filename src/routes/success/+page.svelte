<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStateListener } from '$lib/auth.js';
	import { getUserInfo, editUserInfo } from '$lib/firestore.js';
	import { userInfo } from '$lib/userStore.js';

	let loading = true;

	// Function to handle the successful payment
	const handlePaymentSuccess = async (user) => {
		try {
			// Fetch the latest user info from Firestore
			const fetchedUserInfo = await getUserInfo(user.uid);

			// Update the store with the fetched user info and set subscription status
			userInfo.set({
				...fetchedUserInfo,
				uid: user.uid,
				email: user.email,
				socialMediaHandles: fetchedUserInfo.businessInfo?.website,
				niche: fetchedUserInfo.businessInfo?.niche,
				profileComplete: fetchedUserInfo.profileComplete ?? false,
				subscriptionActive: true // Set subscription as active
			});

			// Update the user info in Firestore to mark the subscription as active
			await editUserInfo(user.uid, { ...fetchedUserInfo, subscriptionActive: true });

			// Redirect the user to the dashboard
			goto('/users');
		} catch (error) {
			console.error('Error updating user info on payment success:', error);
			// Handle the error (e.g., show a message or redirect to an error page)
		} finally {
			loading = false;
		}
	};

	// Protect the dashboard and fetch user info
	onMount(() => {
		authStateListener(async (user) => {
			if (!user) {
				goto('/login');
			} else {
				// Handle the payment success and update the store
				handlePaymentSuccess(user);
			}
		});
	});
</script>

{#if loading}
	<div class="flex items-center justify-center h-screen">
		<span class="loading loading-spinner loading-xl text-emerald-600"></span>
	</div>
{:else}
	<main class="flex items-center justify-center h-screen">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Payment Successful!</h1>
			<p class="mt-4">Thank you for your purchase. Redirecting to your dashboard...</p>
		</div>
	</main>
{/if}
