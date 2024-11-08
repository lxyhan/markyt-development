<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getUserInfo } from '$lib/firestore.js';
	import { signUp, signInWithGoogle, authStateListener } from '$lib/auth.js';

	let email = '';
	let password = '';
	let name = '';
	let userType = '';
	let errorMessage = '';

	const handleSignUp = async () => {
		if (!userType) {
			errorMessage = 'Please select whether you are a Business or an Influencer';
			return;
		}
		try {
			await signUp(email, password, userType, name);
			// Redirect or show success message
		} catch (error) {
			// Handle specific Firebase errors
			if (error.code === 'auth/email-already-in-use') {
				errorMessage = 'This email is already in use. Please use a different email.';
			} else if (error.code === 'auth/weak-password') {
				errorMessage = 'Your password is too weak. Please use at least 6 characters.';
			} else if (error.code === ' auth/invalid-email') {
				errorMessage = 'Invalid Email';
			} else {
				errorMessage = 'An error occurred during sign-up. Please try again.';
			}
		}
	};

	const handleGoogleSignUp = async () => {
		try {
			if (!userType) {
				errorMessage = 'Please select whether you are a Business or an Influencer';
			} else {
				await signInWithGoogle(userType);
			}
			// Redirect or show success message
		} catch (error) {
			errorMessage = 'Failed to sign up with Google. Please try again.';
		}
	};

	onMount(() => {
		authStateListener(async (user) => {
			if (user) {
				console.log('User is authenticated:', user);
				const userInfo = await getUserInfo(user.uid);
				console.log('Retrieved user info:', userInfo);
				goto('/users');
			} else {
				console.log('User is not authenticated');
			}
		});
	});
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-32 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<a href="/"><img class="mx-auto h-10 w-auto" src="/MarkytIcon.png" alt="Your Company" /></a>
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Create your new account
		</h2>
	</div>

	{#if errorMessage}
		<div
			class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<div class="pr-5">
				<strong class="font-bold">Error: </strong>
				<span class="block sm:inline">{errorMessage}</span>
			</div>
			<button
				on:click={() => (errorMessage = '')}
				class="absolute top-0 bottom-0 right-0 px-2 py-3"
			>
				<svg
					class="fill-current h-6 w-6 text-red-500"
					role="button"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<title>Close</title>
					<path
						d="M14.348 5.652a.5.5 0 00-.706 0L10 9.293 6.354 5.646a.5.5 0 10-.708.708L9.293 10l-3.647 3.646a.5.5 0 00.708.708L10 10.707l3.646 3.647a.5.5 0 00.708-.708L10.707 10l3.647-3.646a.5.5 0 000-.702z"
					/>
				</svg>
			</button>
		</div>
	{/if}

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
					>Full Name</label
				>
				<div class="mt-2">
					<input
						bind:value={name}
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0A7E6A] sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
					>Email address</label
				>
				<div class="mt-2">
					<input
						bind:value={email}
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0A7E6A] sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
						>Password</label
					>
					<div class="text-sm">
						<a href="#" class="font-semibold text-[#0A7E6A] hover:text-[#52AF7A]"
							>Forgot password?</a
						>
					</div>
				</div>
				<div class="mt-2">
					<input
						bind:value={password}
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0A7E6A] sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium leading-6 text-gray-900">I am a:</label>
				<div class="mt-2 flex items-center space-x-4">
					<label class="flex items-center">
						<input
							type="radio"
							bind:group={userType}
							value="business"
							class="h-4 w-4 text-[#0A7E6A] focus:ring-[#52AF7A] border-gray-300"
						/>
						<span class="ml-2 text-sm text-gray-900">Business</span>
					</label>
					<label class="flex items-center">
						<input
							type="radio"
							bind:group={userType}
							value="influencer"
							class="h-4 w-4 text-[#0A7E6A] focus:ring-[#52AF7A] border-gray-300"
						/>
						<span class="ml-2 text-sm text-gray-900">Influencer</span>
					</label>
				</div>
				<p class="mt-2 text-sm text-gray-500">
					Please make sure to select the right option. You will not be able to change your account
					type after registration.
				</p>
			</div>

			<div>
				<button
					on:click={handleSignUp}
					type="button"
					class="flex w-full justify-center rounded-md bg-[#0A7E6A] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#52AF7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A7E6A]"
				>
					Sign up
				</button>
			</div>
		</form>

		<!-- Google Auth Button -->
		<div class="mt-6">
			<button
				type="button"
				on:click={handleGoogleSignUp}
				class="flex w-full justify-center rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-50"
			>
				<img class="h-5 w-5 mr-3" src="/google.png" alt="Google" />
				Sign up with Google
			</button>
		</div>

		<p class="mt-10 text-center text-sm text-gray-500">
			Already registered?
			<a href="/login" class="font-semibold leading-6 text-[#0A7E6A] hover:text-[#52AF7A]"
				>Login to your account</a
			>
		</p>
	</div>
</div>
