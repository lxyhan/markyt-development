import { getUserInfo } from '$lib/firestore.js'; // Adjust the path as needed

export async function load({ params }) {
	const { id } = params;
	console.log('Loading user with ID:', id); // Debugging log
	try {
		const userProfile = await getUserInfo(id); // Fetch the profile of the user being viewed
		console.log('Fetched user profile:', userProfile); // Debugging log
		return { userProfile, params };
	} catch (error) {
		console.error('Error loading user profile:', error);
		return { status: 404, error: new Error('User not found') };
	}
}
