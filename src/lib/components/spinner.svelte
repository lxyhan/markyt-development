<!-- Spinner.svelte -->
<script>
	export let loading = true;
</script>

{#if loading}
	<div class="loading-spinner">
		<div class="spinner"></div>
	</div>
{/if}

<style>
	.loading-spinner {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: white;
		z-index: 1000;
	}

	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: #0a7e6a;
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
