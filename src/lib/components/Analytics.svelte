<script>
	import { userInfo } from '$lib/userStore.js';
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale
	} from 'chart.js';

	Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

	let earnings = $userInfo.earnings || 0;
	let ratings = $userInfo.ratings || [];
	let numPosts = $userInfo.numPosts || 0;
	let reviews = $userInfo.reviews.length || [].length;

	let averageRating =
		ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

	function getStarPercentage(average) {
		return (average / 5) * 100;
	}

	let starPercentage = getStarPercentage(averageRating);

	let chart1, chart2;

	onMount(() => {
		const ctx1 = document.getElementById('ratingsChart1').getContext('2d');
		const ctx2 = document.getElementById('ratingsChart2').getContext('2d');

		chart1 = new Chart(ctx1, {
			type: 'line',
			data: {
				labels: ratings.map((_, index) => `Rating ${index + 1}`),
				datasets: [
					{
						label: 'Ratings History',
						data: ratings,
						borderColor: 'rgba(34, 197, 94, 1)',
						backgroundColor: 'rgba(34, 197, 94, 0.2)',
						fill: true,
						tension: 0.1
					}
				]
			},
			options: {
				scales: {
					x: {
						title: { display: true, text: 'Ratings' }
					},
					y: {
						beginAtZero: true,
						title: { display: true, text: 'Rating Value' },
						suggestedMax: 5
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'User Ratings Over Time',
						color: '#22c55e'
					}
				}
			}
		});

		chart2 = new Chart(ctx2, {
			type: 'line',
			data: {
				labels: ratings.map((_, index) => `Rating ${index + 1}`),
				datasets: [
					{
						label: 'Another Metric',
						data: ratings,
						borderColor: 'rgba(34, 197, 94, 1)',
						backgroundColor: 'rgba(34, 197, 94, 0.2)',
						fill: true,
						tension: 0.1
					}
				]
			},
			options: {
				scales: {
					x: {
						title: { display: true, text: 'Ratings' }
					},
					y: {
						beginAtZero: true,
						title: { display: true, text: 'Metric Value' },
						suggestedMax: 5
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'User Metric Over Time',
						color: '#22c55e'
					}
				}
			}
		});
	});
</script>

<div class="space-y-8">
	<!-- Stats Grid: 2x4 Layout -->
	<div class="stats shadow grid grid-cols-4 gap-4">
		<!-- Row 1: Earnings, Matches, and Average Rating (spanning two columns) -->
		<div class="stat place-items-center col-span-1">
			<div class="stat-title">Earnings</div>
			<div class="stat-value text-primary">${earnings}</div>
			<div class="stat-desc">Earnings from posts</div>
		</div>

		<div class="stat place-items-center col-span-1">
			<div class="stat-title">Matches</div>
			<div class="stat-value text-secondary">{ratings.length}</div>
			<div class="stat-desc">
				{$userInfo.userType == 'influencer' ? 'Businesses' : 'Influencers'}
			</div>
		</div>

		<div class="stat place-items-center col-span-2">
			<div class="stat-title">Average Rating</div>
			<div class="stat-value flex items-center">
				<div class="stars-outer mr-2">
					<div class="stars-inner" style="width: {starPercentage}%"></div>
				</div>
				{averageRating.toFixed(1)}
			</div>
			<div class="stat-desc">User's average rating</div>
		</div>
	</div>
	<div class="stats shadow grid grid-cols-4 gap-4">
		<!-- Row 2: Posts, Reviews, and Reviews Carousel -->
		<div class="stat place-items-center col-span-1">
			<div class="stat-title">Posts</div>
			<div class="stat-value text-accent">{numPosts}</div>
			<div class="stat-desc">Total posts uploaded</div>
		</div>

		<div class="stat place-items-center col-span-1">
			<div class="stat-title">Reviews</div>
			<div class="stat-value text-info">{reviews}</div>
			<div class="stat-desc">Total reviews received</div>
		</div>

		<!-- Carousel for Reviews (spanning two columns) -->
		<div class="col-span-2">
			{#if $userInfo.reviews == []}
				<div class="carousel w-full">
					{#each $userInfo.reviews as review, index}
						<div class="carousel-item w-full">
							<div class="card w-full bg-base-100 shadow-md p-4">
								<p class="text-sm text-gray-600">{review[index]}</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="stat place-items-center col-span-2">
					<div class="stat-title">No reviews to display</div>
					<div class="stat-value text-info">No reviews</div>
					<div class="stat-desc">Match with businesses to get reviewed</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Third Row: Two Side-by-Side Graphs -->
	<div class="grid grid-cols-2 gap-4 mt-8">
		<div class="chart-card">
			<div class="chart-container">
				<canvas id="ratingsChart1"></canvas>
			</div>
		</div>

		<div class="chart-card">
			<div class="chart-container">
				<canvas id="ratingsChart2"></canvas>
			</div>
		</div>
	</div>
</div>

<style>
	.chart-container {
		position: relative;
		height: 300px;
		width: 100%;
		margin-top: 20px;
	}

	/* Custom card styling to match theme */
	.chart-card {
		background-color: #f8fffa; /* Tailwind's green-50 */
		border: 1px solid #9c9c9c; /* Tailwind's green-500 */
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.stars-outer {
		display: inline-block;
		position: relative;
		font-family: 'Arial', sans-serif;
		color: #d3d3d3; /* Unlit stars color */
		font-size: 1.75rem; /* Smaller star size */
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
