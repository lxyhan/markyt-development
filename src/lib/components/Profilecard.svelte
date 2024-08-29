<script>
	export let isBusiness;
	export let userProfile;
	console.log(userProfile);
</script>

<div class="card bg-base-100 w-full border border-dotted border-gray-400 rounded-md shadow-none">
	<div class="card-body p-4">
		<div class="flex items-start space-x-4">
			<div class="avatar">
				<div class="avatar">
					<div class="w-12 rounded">
						<img src={userProfile.profilePicture} alt="Tailwind-CSS-Avatar-component" />
					</div>
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
			class="rounded-md my-1 w-full h-auto object-cover"
		/>
		<p class="text-sm">{userProfile.description}</p>
		<!-- Additional profile details can be added here -->

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
						<td class="font-bold">Instagram Handle</td>
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
	</div>
</div>
