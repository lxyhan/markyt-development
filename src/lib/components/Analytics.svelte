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
		CategoryScale,
		Filler
	} from 'chart.js';

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Filler
	);
	Chart.defaults.font.family = 'Arial';

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

	let currentIndex = 0;

	// Function to scroll the carousel
	function scrollCarousel(direction) {
		const items = document.querySelectorAll('.carousel-item');
		const totalItems = items.length;
		currentIndex = (currentIndex + direction + totalItems) % totalItems;

		// Scroll to the selected item
		const container = document.querySelector('.carousel');
		container.scrollTo({
			left: items[currentIndex].offsetLeft,
			behavior: 'smooth'
		});
	}
	let isPostsCumulative = false;
	let isEarningsCumulative = false;

	function calculateCumulativeData(data) {
		let cumulativeSum = 0;
		return data.map((value) => {
			cumulativeSum += parseInt(value, 10); // Convert the string to an integer
			return cumulativeSum;
		});
	}

	function updateCharts() {
		console.log(calculateCumulativeData($userInfo.postsHistory));
		console.log($userInfo.postsHistory);
		console.log(calculateCumulativeData($userInfo.earningsHistory));
		console.log($userInfo.earningsHistory);

		chart1.data.datasets[0].data = isPostsCumulative
			? calculateCumulativeData($userInfo.postsHistory)
			: $userInfo.postsHistory;
		chart2.data.datasets[0].data = isEarningsCumulative
			? calculateCumulativeData($userInfo.earningsHistory)
			: $userInfo.earningsHistory;

		// Update chart1 title
		chart1.options.plugins.title.text = isPostsCumulative
			? 'User Posts Over Time'
			: 'User Posts by Campaign';

		// Update chart2 title
		chart2.options.plugins.title.text = isEarningsCumulative
			? 'User Earnings Over Time'
			: 'User Earnings by Campaign';

		chart1.update();
		chart2.update();
	}

	onMount(() => {
		const ctx1 = document.getElementById('postsChart').getContext('2d');
		const ctx2 = document.getElementById('earningsChart').getContext('2d');

		chart1 = new Chart(ctx1, {
			type: 'line',
			data: {
				labels: $userInfo.postsHistory.map((_, index) => `${index + 1}`),
				datasets: [
					{
						label: 'Posts History',
						data: $userInfo.postsHistory,
						borderColor: 'rgba(0, 153, 76, 1)', // Line color
						backgroundColor: 'rgba(0, 153, 76, 0.2)', // Fill color under the line (Tailwind's indigo-500 with opacity)
						fill: true, // Enable filling under the line
						pointBackgroundColor: 'rgba(99, 102, 241, 1)',
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
						tension: 0.3
					}
				]
			},
			options: {
				maintainAspectRatio: false, // Disable aspect ratio maintenance
				scales: {
					x: {
						title: { display: true, text: 'Campaign' }
					},
					y: {
						beginAtZero: true,
						title: { display: true, text: 'Number of Posts' },
						suggestedMax: Math.max(...$userInfo.postsHistory) + 2
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'User Posts by Campaign',
						color: '#808080',
						font: {
							family: 'Arial' // Change to 'Arial' as requested
						}
					}
				}
			}
		});

		chart2 = new Chart(ctx2, {
			type: 'line',
			data: {
				labels: $userInfo.earningsHistory.map((_, index) => `${index + 1}`),
				datasets: [
					{
						label: 'Earnings History',
						data: $userInfo.earningsHistory,
						borderColor: 'rgba(0, 153, 76, 1)', // Line color
						backgroundColor: 'rgba(0, 153, 76, 0.2)', // Fill color under the line (Tailwind's green-500 with opacity)
						fill: true, // Enable filling under the line
						pointBackgroundColor: 'rgba(34, 197, 94, 1)',
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: 'rgba(34, 197, 94, 1)',
						tension: 0.3
					}
				]
			},
			options: {
				maintainAspectRatio: false, // Disable aspect ratio maintenance
				scales: {
					x: {
						title: { display: true, text: 'Campaign' }
					},
					y: {
						beginAtZero: true,
						title: { display: true, text: 'Earnings Value' },
						suggestedMax: Math.max(...$userInfo.earningsHistory) + 100
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'User Earnings by Campaign',
						color: '#808080',
						font: {
							family: 'Arial' // Change to 'Arial' as requested
						}
					}
				}
			}
		});
	});

	$: if (isPostsCumulative || isEarningsCumulative) {
		updateCharts();
	}
</script>

<div class="space-y-8">
	<!-- Stats Grid: Responsive Layout -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		<!-- Row 1: Earnings, Matches, Average Rating, and Posts -->
		<div class="bg-white overflow-hidden shadow rounded-lg p-3 text-center">
			<div class="text-sm font-medium text-gray-500 truncate">Earnings</div>
			<div class="mt-1 text-3xl font-semibold text-primary">${earnings}</div>
			<div class="text-gray-500 mt-2">Earnings from posts</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg p-3 text-center">
			<div class="text-sm font-medium text-gray-500 truncate">Matches</div>
			<div class="mt-1 text-3xl font-semibold text-secondary">{ratings.length}</div>
			<div class="text-gray-500 mt-2">
				{$userInfo.userType == 'influencer' ? 'Businesses' : 'Influencers'}
			</div>
		</div>

		<div
			class="sm:col-span-2 lg:col-span-2 bg-white overflow-hidden shadow rounded-lg p-3 text-center"
		>
			<div class="text-sm font-medium text-gray-500 truncate">Average Rating</div>
			<div class="mt-1 text-3xl font-semibold flex justify-center items-center">
				<div class="stars-outer mr-2">
					<div class="stars-inner" style="width: {starPercentage}%"></div>
				</div>
				{averageRating.toFixed(1)}
			</div>
			<div class="text-gray-500 mt-2">User's average rating</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		<div class="bg-white overflow-hidden shadow rounded-lg p-3 text-center">
			<div class="text-sm font-medium text-gray-500 truncate">Posts</div>
			<div class="mt-1 text-3xl font-semibold text-accent">{numPosts}</div>
			<div class="text-gray-500 mt-2">Total posts uploaded</div>
		</div>
		<div class="bg-white overflow-hidden shadow rounded-lg p-3 text-center">
			<div class="text-sm font-medium text-gray-500 truncate">Reviews</div>
			<div class="mt-1 text-3xl font-semibold text-info">{reviews}</div>
			<div class="text-gray-500 mt-2">Total reviews received</div>
		</div>

		<!-- Carousel for Reviews (spanning all columns on small screens, three columns on larger screens) -->
		<div
			class="lg:col-span-2 sm:col-span-2 col-span-1 bg-white overflow-hidden shadow rounded-lg p-5"
		>
			{#if $userInfo.reviews.length === 0}
				<div class="text-center">
					<div class="text-sm font-medium text-gray-500 truncate">No reviews to display</div>
					<div class="text-gray-500 mt-2">Match with businesses to get reviewed</div>
				</div>
			{:else}
				<div class="relative w-full">
					<div class="carousel w-full overflow-hidden">
						{#each $userInfo.reviews as review}
							<div class="carousel-item w-full flex-shrink-0">
								<div class="bg-white shadow p-4 rounded-lg">
									<div class="flex items-center space-x-4">
										<img
											src={review.reviewerProfile}
											alt={review.reviewerName}
											class="w-10 h-10 rounded-full object-cover"
										/>
										<div>
											<p class="text-lg font-semibold text-gray-800">{review.reviewerName}</p>
											<p class="text-sm text-gray-500">{review.reviewerEmail}</p>
										</div>
									</div>
									<p class="mt-4 text-gray-600">{review.review}</p>
								</div>
							</div>
						{/each}
					</div>

					<!-- Navigation buttons -->
					<button
						class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 opacity-75 hover:opacity-100"
						on:click={() => scrollCarousel(-1)}
					>
						&lt;
					</button>
					<button
						class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 opacity-75 hover:opacity-100"
						on:click={() => scrollCarousel(1)}
					>
						&gt;
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Third Row: Stacked Charts on Smaller Screens, Side-by-Side on Larger Screens -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
		<div class="bg-white overflow-hidden shadow rounded-lg p-3">
			<div class="chart-container">
				<canvas id="postsChart"></canvas>
			</div>
			<div class="switch-container mt-4 flex items-center">
				<label class="switch-label mr-3">Posts over time</label>
				<div
					class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
				>
					<input
						type="checkbox"
						id="togglePosts"
						class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
						bind:checked={isPostsCumulative}
						on:change={updateCharts}
					/>
					<label
						for="togglePosts"
						class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
					></label>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg p-3">
			<div class="chart-container">
				<canvas id="earningsChart"></canvas>
			</div>
			<div class="switch-container mt-4 flex items-center">
				<label class="switch-label mr-3">Earnings over time</label>
				<div
					class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
				>
					<input
						type="checkbox"
						id="toggleEarnings"
						class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
						bind:checked={isEarningsCumulative}
						on:change={updateCharts}
					/>
					<label
						for="toggleEarnings"
						class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
					></label>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.chart-container {
		position: relative;
		height: 300px;
		width: 100%; /* Ensures the chart is square */
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

	.carousel {
		display: flex;
		gap: 16px; /* Space between items */
		scroll-snap-type: x mandatory;
	}
	.carousel-item {
		scroll-snap-align: start;
	}
	.carousel-item img {
		border-radius: 50%;
	}

	.toggle-checkbox:checked {
		right: 0;
		border-color: #2f7359; /* Tailwind's indigo-500 */
	}

	.toggle-checkbox:checked + .toggle-label {
		background-color: #2f7359; /* Tailwind's indigo-500 */
	}
</style>
