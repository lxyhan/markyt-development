<script>
	import { userInfo } from '$lib/userStore.js'; // Import the user store
	import Profilecard from '$lib/components/Profilecard.svelte';
	import BusinessProfileEditor from '../../../lib/components/BusinessProfileEditor.svelte';
	import CompleteCampaignModal from '../../../lib/components/CompleteCampaignModal.svelte';
	import { goto } from '$app/navigation';
	import ProfileEditor from '../../../lib/components/ProfileEditor.svelte';
	import { editUserInfo } from '$lib/firestore.js';
	export let data;

	// Destructure the userProfile from the data prop
	let userProfile = data.userProfile;
	const params = data.params;
	console.log($userInfo);

	// Set default values
	let isInfluencer = userProfile.userType === 'influencer';
	let isBusiness = userProfile.userType === 'business';

	// Just to make sure, let's log everything
	console.log('User Profile:', userProfile.userType);
	console.log('Is Influencer:', isInfluencer);
	console.log('Is Business:', isBusiness);
	console.log($userInfo);

	let showModal = false;

	const handleCompleteCampaign = () => {
		showModal = true;
	};

	const handleModalClose = () => {
		showModal = false;
		console.log('trying to close');
	};

	$: console.log($userInfo); // This logs the updated userInfo to the console

	function handleModalSubmit({ rating, NewEarnings, review, NewPosts }) {
		console.log($userInfo.ratings);
		userInfo.update((currentInfo) => ({
			...currentInfo,
			earnings: Number(currentInfo.earnings || 0) + Number(NewEarnings),
			numPosts: Number(currentInfo.numPosts || 0) + Number(NewPosts),
			earningsHistory: [...(userProfile.earningsHistory || []), NewEarnings],
			postsHistory: [...(userProfile.postsHistory || []), NewPosts]
		}));
		console.log($userInfo);
		editUserInfo($userInfo.uid, $userInfo);

		// Assuming userProfile is a regular object, not a Svelte store
		userProfile = {
			...userProfile, // Spread the existing properties
			uid: params.id, // Update the uid
			ratings: [...(userProfile.ratings || []), rating], // Add the new rating to the array
			reviews: [
				...(userProfile.reviews || []),
				{
					review: review,
					reviewerName: $userInfo.name,
					reviewerEmail: $userInfo.email,
					reviewerProfile: $userInfo.profilePicture
				}
			] // Add the new review to the array
		};

		// If you need to reflect these changes in a reactive Svelte context, you would need to assign the updated object

		editUserInfo(params.id, userProfile);
	}
</script>

{#if !isBusiness}
	<BusinessProfileEditor></BusinessProfileEditor>
{:else}
	<ProfileEditor></ProfileEditor>
{/if}

{#if $userInfo.profileComplete}
	<hr />
	<!-- Two-column layout -->
	<div class="flex gap-4">
		<!-- Column 1: Business Profile Editor -->
		<div class="flex-none w-1/2 pl-10 py-10">
			<Profilecard {userProfile} {isBusiness}></Profilecard>
		</div>
		<!-- Column 2: Profile Card (only if profile is complete) -->
		<div class="flex flex-col w-full md:w-1/2 py-10 px-10">
			<div class="flex flex-col md:flex-row pb-3 w-full">
				<div class="flex-1 justify-start">
					<h1 class="text-2xl font-bold">Messages</h1>
				</div>
				<div class="flex justify-end mt-4 md:mt-0">
					<span class="block">
						<button
							on:click={() => goto('/users')}
							type="button"
							class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="size-5"
							>
								<path
									fill-rule="evenodd"
									d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
									clip-rule="evenodd"
								/>
							</svg>
							Return to Dashboard
						</button>
					</span>
				</div>
			</div>
			<hr />
			<div class="flex w-full mt-6">
				{#if !isBusiness}
					<h1>Messages with Influencer</h1>
				{/if}
			</div>
			<div class="flex justify-end mt-6">
				<button
					type="button"
					class="inline-flex items-center rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
					on:click={handleCompleteCampaign}
				>
					Complete Campaign
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Render the modal only if showModal is true -->
{#if showModal}
	<CompleteCampaignModal onClose={handleModalClose} onSubmit={handleModalSubmit} />
{/if}
