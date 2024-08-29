<script>
	export let isBusiness;
	export let userProfile;

	// Calculate the average rating from the ratings array
	function calculateAverageRating(ratings) {
		if (!ratings || ratings.length === 0) return 0;
		const total = ratings.reduce((sum, rating) => sum + rating, 0);
		return total / ratings.length;
	}

	// Function to generate star percentage
	function getStarPercentage(average) {
		return (average / 5) * 100;
	}
</script>

<div class="card bg-base-100 w-full border border-dotted border-gray-400 rounded-md shadow-none">
	<div class="card-body p-4">
		<div class="flex items-start space-x-4">
			<div class="avatar">
				<div class="w-12 rounded">
					<img src={userProfile.profilePicture} alt="Avatar" />
				</div>
			</div>
			<!-- User Name and Description -->
			<div>
				<h1 class="card-title text-xl font-bold">{userProfile.name}</h1>
				<h2 class="card-text text-sm">{userProfile.description}</h2>
			</div>
		</div>

		<img
			src={userProfile.bannerPicture}
			alt={userProfile.name}
			class="rounded-md my-1 w-full h-[275px] object-cover overflow-hidden"
		/>

		<!-- Additional profile details -->
		<p class="text-sm">{userProfile.description}</p>

		<!-- Table Section -->
		<div class="overflow-x-auto mt-4">
			<table class="table table-zebra w-full text-xs">
				<tbody>
					<!-- row 1 -->
					<tr class="border-b border-gray-200">
						<td class="font-bold">Email:</td>
						<td>{userProfile.email}</td>
					</tr>
					<!-- row 2 -->
					<tr class="border-b border-gray-200">
						<td class="font-bold">Location:</td>
						<td>{userProfile.city}, {userProfile.province}</td>
					</tr>
					<!-- row 3 -->
					<tr class="border-b border-gray-200">
						<td class="font-bold">Instagram Handle:</td>
						<td
							>{isBusiness
								? userProfile.businessInfo.website
								: userProfile.influencerInfo.socialMediaHandles}</td
						>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- End Table Section -->

		<!-- Analytics Section -->
		<div class="mt-4">
			<div class="stats shadow grid grid-cols-2 gap-4 mt-4">
				<!-- Posts Stat -->
				<div class="stat place-items-center">
					<div class="stat-title">Posts</div>
					<div class="stat-value">{userProfile.numPosts || 0}</div>
					<div class="stat-desc">Total posts uploaded</div>
				</div>

				<!-- Average Rating Stat with Stars -->
				<div class="stat place-items-center col-span-1">
					<div class="stat-title">Average Rating</div>
					<div class="stat-value flex items-center">
						<span>{calculateAverageRating(userProfile.ratings || []).toFixed(1)}</span>
						<div class="stars-outer ml-2">
							<div
								class="stars-inner"
								style="width: {getStarPercentage(
									calculateAverageRating(userProfile.ratings || [])
								)}%"
							></div>
						</div>
					</div>
					<div class="stat-desc">User's average rating</div>
				</div>
			</div>
		</div>

		<!-- End Analytics Section -->
	</div>
</div>

<style>
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
