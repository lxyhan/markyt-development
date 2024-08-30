<script>
	import { authStateListener, signInWithGoogle, signIn, sendPasswordReset } from '$lib/auth.js';
	import { getUserInfo } from '$lib/firestore.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMessage = '';
	let resetErrorMessage = '';
	let resetSuccessMessage = '';
	let resetPasswordModal;

	const handleSignIn = async () => {
		try {
			const userCredential = await signIn(email, password);
			// Success handling, if needed
		} catch (error) {
			console.error('Error during sign-in:', error);
			errorMessage = 'Incorrect email or password. Please try again.';
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await signInWithGoogle();
			// Redirect or show success message
		} catch (error) {
			errorMessage = 'Failed to sign in with Google. Please try again.';
		}
	};

	onMount(() => {
		authStateListener(async (user) => {
			if (user) {
				const userInfo = await getUserInfo(user.uid);
				goto('/users');
			}
		});
	});

	const handleCloseAlert = () => {
		errorMessage = ''; // Clear the error message to close the alert
	};

	function openModal() {
		resetPasswordModal = true;
	}

	function closeModal() {
		resetPasswordModal = false;
	}

	const handleForgotPassword = async () => {
		console.log('clicked');
		try {
			await sendPasswordReset(email);
			resetSuccessMessage = 'Password reset email sent! Please check your inbox.';
			resetErrorMessage = '';
			resetPasswordModal = false;
		} catch (error) {
			if (error.code === 'auth/user-not-found') {
				resetErrorMessage = 'No user found with this email address.';
			} else {
				resetErrorMessage = 'Please enter an email to reset your password';
			}
			resetSuccessMessage = '';
		}
	};
</script>

{#if resetPasswordModal}
	<div
		class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
		aria-hidden="true"
	></div>

	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
			<div
				class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
			>
				<div class="flex justify-between">
					<h3 class="text-lg leading-6 font-medium text-gray-900">Reset Password</h3>
					<!-- Close Button -->
					<button type="button" on:click={closeModal}>
						<span class="sr-only">Close</span>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div class="mt-4">
					<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
					<div class="mt-2">
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0A7E6A] sm:text-sm sm:leading-6"
							placeholder="Enter your email"
						/>
					</div>
				</div>

				<div class="mt-5 sm:mt-6">
					<button
						type="button"
						on:click={handleForgotPassword}
						class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0A7E6A] text-base font-medium text-white hover:bg-[#52AF7A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A7E6A] sm:text-sm"
					>
						Reset Password
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="flex min-h-full flex-col justify-center px-6 py-32 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img class="mx-auto h-10 w-auto" src="/MarkytIcon.png" alt="Your Company" />
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Sign in to your account
		</h2>
	</div>

	<!-- Error Alert -->
	{#if errorMessage}
		<div
			class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<div class="pr-5">
				<strong class="font-bold">Error: </strong>
				<span class="block sm:inline">{errorMessage}</span>
			</div>
			<button on:click={handleCloseAlert} class="absolute top-0 bottom-0 right-0 px-4 py-3">
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

	{#if resetErrorMessage}
		<div
			class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<strong class="font-bold">Error: </strong>
			<span class="block sm:inline">{resetErrorMessage}</span>
			<button
				on:click={() => (resetErrorMessage = '')}
				class="absolute top-0 bottom-0 right-0 px-4 py-3"
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

	{#if resetSuccessMessage}
		<div
			class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<strong class="font-bold">Success: </strong>
			<span class="block sm:inline">{resetSuccessMessage}</span>
			<button
				on:click={() => (resetSuccessMessage = '')}
				class="absolute top-0 bottom-0 right-0 px-4 py-3"
			>
				<svg
					class="fill-current h-6 w-6 text-green-500"
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
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="text-sm">
						<!-- svelte-ignore missing-declaration -->
						<a on:click={openModal} class="font-semibold text-[#0A7E6A] hover:text-[#52AF7A]"
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
				<button
					on:click={handleSignIn}
					type="button"
					class="flex w-full justify-center rounded-md bg-[#0A7E6A] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#52AF7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A7E6A]"
				>
					Sign in
				</button>
			</div>
		</form>

		<!-- Google Auth Button -->
		<div class="mt-6">
			<button
				type="button"
				on:click={handleGoogleSignIn}
				class="flex w-full justify-center rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-50"
			>
				<img class="h-5 w-5 mr-3" src="/google.png" alt="Google" />
				Sign in with Google
			</button>
		</div>

		<p class="mt-10 text-center text-sm text-gray-500">
			Don't have an account?
			<a href="/signup" class="font-semibold leading-6 text-[#0A7E6A] hover:text-[#52AF7A]"
				>Sign up</a
			>
		</p>
	</div>
</div>
