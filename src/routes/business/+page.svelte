<script>
	import BusinessProfileEditor from '../../lib/components/BusinessProfileEditor.svelte';
	import InfluencerMatches from '../../lib/components/InfluencerMatches.svelte';
	import BusinessAnalytics from '../../lib/components/BusinessAnalytics.svelte';

	import PaymentPortal from '../../lib/components/PaymentPortal.svelte';
</script>

<main class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
	<!-- Business Profile Editor at the top -->
	<div class="col-span-1 lg:col-span-2">
		<BusinessProfileEditor />
	</div>

	<!-- Influencer Matches and Payment Portal side by side in the second row -->
	<div class="col-span-1">
		<PaymentPortal />
		{#if true}
			<InfluencerMatches />
		{/if}
	</div>

	<!-- Business Analytics on the right -->
	<div class="col-span-1">
		<BusinessAnalytics />
	</div>
</main>
