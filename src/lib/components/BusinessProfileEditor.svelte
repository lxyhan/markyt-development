<script>
	import { onMount } from 'svelte';
	import { logout, authStateListener } from '$lib/auth.js';
	import { getUserInfo, editUserInfo } from '$lib/firestore.js';
	import { goto } from '$app/navigation';
	import { userInfo, resetUserInfo } from '$lib/userStore.js';
	import { get } from 'svelte/store';

	// Function to handle logout
	const handleLogout = async () => {
		try {
			await logout();
			resetUserInfo(); // Reset userInfo on logout
			goto('/login'); // Redirect to login page
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	let loading = true; // Add this line for loading state

	// Protect the dashboard and fetch user info
	onMount(() => {
		authStateListener(async (user) => {
			if (user) {
				try {
					const fetchedUserInfo = await getUserInfo(user.uid);
					console.log(fetchedUserInfo);
					console.log(fetchedUserInfo.businessInfo);
					userInfo.set({
						...fetchedUserInfo,
						uid: user.uid,
						email: user.email,
						socialMediaHandles: fetchedUserInfo.businessInfo.website,
						niche: fetchedUserInfo.businessInfo.niche,
						profileComplete:
							fetchedUserInfo.profileComplete !== undefined
								? fetchedUserInfo.profileComplete
								: false
					});
					console.log($userInfo);
				} catch (error) {
					console.error('Error fetching user info:', error);
				} finally {
					loading = false; // Set loading to false after data is fetched
				}
			} else {
				// If the user is not authenticated, redirect to the login page
				goto('/login');
			}
		});
	});

	// Save function to send data to Firebase
	const handleSaveProfile = async () => {
		try {
			loading = true; // Start loading before save operation
			userInfo.update((info) => {
				return { ...info, profileComplete: true };
			});

			const data = get(userInfo); // Get the current userInfo data
			await editUserInfo(data.uid, data); // Pass the userInfo object to Firebase
		} catch (error) {
			console.error('Error saving profile:', error);
		} finally {
			loading = false; // Stop loading after save operation
		}
	};

	const handleEditClick = () => {
		userInfo.update((info) => {
			console.log(':', info); // Debugging line
			return { ...info, profileComplete: false };
		});
	};
</script>

<div>
	{#if loading}
		<!-- Display a loading spinner or animation -->
		<div class="loading-spinner">
			<!-- Example: A simple CSS spinner -->
			<div class="spinner"></div>
		</div>
	{:else}
		<!-- Your main content goes here -->
		<div class="main-content">
			<div
				class="{$userInfo.profileComplete
					? ' '
					: 'fixed-header'} lg:flex py-10 pr-10 pl-10 lg:items-center lg:justify-between"
			>
				<div class="min-w-0 flex-1">
					<h2
						class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
					>
						{$userInfo.name}
					</h2>
					<p>
						{$userInfo.description}
					</p>
					<div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
						<div class="mt-2 flex items-center text-sm text-gray-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
								/>
							</svg>
							{$userInfo.socialMediaHandles}
						</div>
						<div class="mt-2 flex items-center text-sm text-gray-500">
							<svg
								class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
									clip-rule="evenodd"
								/>
							</svg>
							{$userInfo.city + ', ' + $userInfo.province}
						</div>
						<div class="mt-2 flex items-center text-sm text-gray-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
								/>
							</svg>

							{$userInfo.email}
						</div>
						<div class="mt-2 flex items-center text-sm text-gray-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
								/>
							</svg>

							{' Niche: ' + $userInfo.niche}
						</div>
					</div>
				</div>
				<div class="mt-5 flex lg:ml-4 lg:mt-0">
					<span class="hidden sm:block">
						<button
							on:click={handleEditClick}
							type="button"
							class="{$userInfo.profileComplete
								? 'bg-white'
								: 'opacity-50 '} inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							disabled={!$userInfo.profileComplete}
						>
							<svg
								class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
								/>
							</svg>
							{$userInfo.profileComplete ? 'Edit' : 'Currently Editing '}
						</button>
					</span>

					<span class="ml-3 hidden sm:block">
						<button
							type="button"
							class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<svg
								class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"
								/>
								<path
									d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"
								/>
							</svg>
							View
						</button>
					</span>

					<span class="sm:ml-3">
						<button
							on:click={handleLogout}
							type="button"
							class="inline-flex items-center rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
								/>
							</svg>

							Log Out
						</button>
					</span>

					<!-- Dropdown -->
					<div class="relative ml-3 sm:hidden">
						<button
							type="button"
							class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
							id="mobile-menu-button"
							aria-expanded="false"
							aria-haspopup="true"
						>
							More
							<svg
								class="-mr-1 ml-1.5 h-5 w-5 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>

						<!--
          Dropdown menu, show/hide based on menu state.
  
          Entering: "transition ease-out duration-200"
            From: "transform opacity-0 scale-95"
            To: "transform opacity-100 scale-100"
          Leaving: "transition ease-in duration-75"
            From: "transform opacity-100 scale-100"
            To: "transform opacity-0 scale-95"
        -->
						<div
							class="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="mobile-menu-button"
							tabindex="-1"
						>
							<button
								on:click={handleEditClick}
								class="block px-4 py-2 text-sm text-gray-700"
								role="menuitem"
								tabindex="-1"
								id="mobile-menu-item-0">Edit</button
							>

							<a
								href="#"
								class="block px-4 py-2 text-sm text-gray-700"
								role="menuitem"
								tabindex="-1"
								id="mobile-menu-item-1">View</a
							>
						</div>
					</div>
				</div>
			</div>

			{#if !$userInfo.profileComplete}
				<div class="py-20 pl-10 pr-10 content">
					<h1
						class="text-1xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight pb-2"
					>
						Create your virtual storefront
					</h1>
					<form on:submit={handleSaveProfile}>
						<div class="space-y-12">
							<div class="border-b border-gray-900/10 pb-12">
								<h2 class="text-base font-semibold leading-7 text-gray-900">Profile</h2>
								<p class="mt-1 text-sm leading-6 text-gray-600">
									This information will be displayed publicly so be careful what you share.
								</p>

								<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
									<div class="sm:col-span-4">
										<label for="username" class="block text-sm font-medium leading-6 text-gray-900"
											>Business Name</label
										>
										<div class="mt-2">
											<div
												class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
											>
												<span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"
													>markyt.ca/</span
												>
												<input
													bind:value={$userInfo.name}
													type="text"
													name="username"
													id="username"
													autocomplete="username"
													required
													class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
													placeholder={userInfo.name}
												/>
											</div>
										</div>
									</div>

									<div class="col-span-full">
										<label for="about" class="block text-sm font-medium leading-6 text-gray-900"
											>About your business</label
										>
										<div class="mt-2">
											<textarea
												bind:value={$userInfo.description}
												id="about"
												name="about"
												rows="3"
												required
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											></textarea>
										</div>
										<p class="mt-3 text-sm leading-6 text-gray-600">
											Write a few sentences about your business.
										</p>
									</div>

									<div class="col-span-full">
										<label for="photo" class="block text-sm font-medium leading-6 text-gray-900"
											>Photo</label
										>
										<div class="mt-2 flex items-center gap-x-3">
											<svg
												class="h-12 w-12 text-gray-300"
												viewBox="0 0 24 24"
												fill="currentColor"
												aria-hidden="true"
											>
												<path
													fill-rule="evenodd"
													d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
													clip-rule="evenodd"
												/>
											</svg>
											<button
												type="button"
												class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
												>Change</button
											>
										</div>
									</div>

									<div class="col-span-full">
										<label
											for="cover-photo"
											class="block text-sm font-medium leading-6 text-gray-900">Cover photo</label
										>
										<div
											class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
										>
											<div class="text-center">
												<svg
													class="mx-auto h-12 w-12 text-gray-300"
													viewBox="0 0 24 24"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
														clip-rule="evenodd"
													/>
												</svg>
												<div class="mt-4 flex text-sm leading-6 text-gray-600">
													<label
														for="file-upload"
														class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
													>
														<span>Upload a file</span>
														<input
															id="file-upload"
															name="file-upload"
															type="file"
															class="sr-only"
														/>
													</label>
													<p class="pl-1">or drag and drop</p>
												</div>
												<p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="border-b border-gray-900/10 pb-12">
								<h2 class="text-base font-semibold leading-7 text-gray-900">
									Business Information
								</h2>
								<p class="mt-1 text-sm leading-6 text-gray-600">
									Use a permanent address where you can receive mail.
								</p>

								<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
									<div class="sm:col-span-3">
										<label
											for="first-name"
											class="block text-sm font-medium leading-6 text-gray-900">Website</label
										>
										<div class="mt-2">
											<input
												type="text"
												required
												bind:value={$userInfo.socialMediaHandles}
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>

									<div class="sm:col-span-3">
										<label for="country" class="block text-sm font-medium leading-6 text-gray-900"
											>Niche</label
										>
										<div class="mt-2">
											<select
												bind:value={$userInfo.niche}
												id="country"
												name="country"
												required
												autocomplete="country-name"
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
											>
												<option>Sports</option>
												<option>Food</option>
												<option>Fashion</option>
											</select>
										</div>
									</div>

									<div class="sm:col-span-2 sm:col-start-1">
										<label for="city" class="block text-sm font-medium leading-6 text-gray-900"
											>City</label
										>
										<div class="mt-2">
											<input
												bind:value={$userInfo.city}
												type="text"
												name="city"
												id="city"
												required
												autocomplete="address-level2"
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>

									<div class="sm:col-span-2">
										<label for="region" class="block text-sm font-medium leading-6 text-gray-900"
											>State / Province</label
										>
										<div class="mt-2">
											<input
												bind:value={$userInfo.province}
												type="text"
												name="region"
												id="region"
												required
												autocomplete="address-level1"
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>

									<div class="sm:col-span-2">
										<label
											for="postal-code"
											class="block text-sm font-medium leading-6 text-gray-900"
											>ZIP / Postal code</label
										>
										<div class="mt-2">
											<input
												bind:value={$userInfo.postalCode}
												type="text"
												required
												name="postal-code"
												id="postal-code"
												autocomplete="postal-code"
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>
								</div>
							</div>

							<div class="mt-6 flex items-center justify-end gap-x-6">
								<!-- <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button> -->
								<button
									type="submit"
									class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>Save</button
								>
							</div>
						</div>
					</form>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.fixed-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: white;
		z-index: 1000; /* Ensure it's above other content */
		padding: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: adds a shadow for a floating effect */
	}

	.content {
		padding-top: 170px; /* Add margin equal to the height of the fixed header to avoid overlap */
	}

	.loading-spinner {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh; /* Fullscreen height */
	}

	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: #0a7e6a; /* Example color */
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
