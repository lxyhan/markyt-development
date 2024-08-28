import {
	getFirestore,
	collection,
	doc,
	setDoc,
	updateDoc,
	query,
	where,
	getDoc,
	getDocs
} from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export const getUserInfo = async (userId) => {
	try {
		const userDoc = await getDoc(doc(db, 'users', userId));
		if (userDoc.exists()) {
			const userInfo = userDoc.data();
			if (userInfo.userType === 'business') {
				// Get business-specific info
				const businessInfoDoc = await getDoc(doc(db, 'users', userId, 'businessInfo', 'details'));
				return {
					...userInfo,
					businessInfo: businessInfoDoc.exists() ? businessInfoDoc.data() : null
				};
			} else if (userInfo.userType === 'influencer') {
				// Get influencer-specific info
				const influencerInfoDoc = await getDoc(
					doc(db, 'users', userId, 'influencerInfo', 'details')
				);
				return {
					...userInfo,
					influencerInfo: influencerInfoDoc.exists() ? influencerInfoDoc.data() : null
				};
			}
			return userInfo; // Return basic info if no subcollection exists
		} else {
			throw new Error('No user found with the given ID');
		}
	} catch (error) {
		console.error('Error retrieving user info:', error);
		throw error;
	}
};

export const editUserInfo = async (userId, userInfo) => {
	const userRef = doc(db, 'users', userId);

	try {
		// Log the userInfo object for debugging
		console.log('Updating user info:', userInfo);

		// Set basic user info
		await setDoc(
			userRef,
			{
				name: userInfo.name,
				description: userInfo.description,
				profileComplete: userInfo.profileComplete,
				province: userInfo.province,
				city: userInfo.city,
				postalCode: userInfo.postalCode,
				profilePicture: userInfo.profilePicture,
				bannerPicture: userInfo.bannerPicture,
				createdAt: userInfo.createdAt || new Date().toISOString()
			},
			{ merge: true }
		);

		// Handle influencer-specific information if the user is an influencer
		if (userInfo.userType === 'influencer') {
			const influencerRef = doc(db, 'users', userId, 'influencerInfo', 'details');
			await setDoc(
				influencerRef,
				{
					socialMediaHandles: userInfo.socialMediaHandles,
					niche: userInfo.niche
					// Add any additional influencer-specific fields here
				},
				{ merge: true }
			);
			console.log('Updated influencer info:', userInfo.socialMediaHandles, userInfo.niche);
		}

		// Handle business-specific information if the user is a business
		if (userInfo.userType === 'business') {
			const businessRef = doc(db, 'users', userId, 'businessInfo', 'details');
			await setDoc(
				businessRef,
				{
					website: userInfo.website, // Assuming website is the correct field for business
					niche: userInfo.niche
					// Add any additional business-specific fields here
				},
				{ merge: true }
			);
			console.log('Updated business info:', userInfo.website, userInfo.niche);
		}

		console.log('User information updated successfully');
	} catch (error) {
		console.error('Error updating user info:', error);
		throw error;
	}
};

export const getInfluencers = async (filters = {}) => {
	try {
		// Reference to the users collection
		const usersRef = collection(db, 'users');

		// Build query to find all influencers
		let q = query(usersRef, where('userType', '==', 'influencer'));

		// Execute the query to get influencer users
		const userSnapshot = await getDocs(q);
		console.log('User Snapshot:', userSnapshot.docs);

		// Array to hold influencer data
		const influencers = [];

		// Loop through each influencer user document
		for (const userDoc of userSnapshot.docs) {
			const userId = userDoc.id;

			// Log the current user ID being processed
			console.log(`Processing influencer with user ID: ${userId}`);

			// Reference to the InfluencerInfo subcollection
			const influencerInfoRef = collection(db, `users/${userId}/influencerInfo`);
			const influencerInfoSnapshot = await getDocs(influencerInfoRef);

			// Log the InfluencerInfo snapshot
			console.log('Influencer Info Snapshot:', influencerInfoSnapshot.docs);

			// If the influencer has data in the InfluencerInfo subcollection, filter it
			influencerInfoSnapshot.forEach((doc) => {
				let influencerData = doc.data();
				console.log('Raw Influencer Data:', influencerData);

				// Apply filters if provided
				if (filters.niche && influencerData.niche !== filters.niche) {
					console.log('Niche filter did not match:', influencerData.niche);
					return;
				}
				if (filters.minFollowers && influencerData.followers < filters.minFollowers) {
					console.log('Min Followers filter did not match:', influencerData.followers);
					return;
				}
				if (filters.location && influencerData.location !== filters.location) {
					console.log('Location filter did not match:', influencerData.location);
					return;
				}

				// Log the data that passed the filters
				console.log('Filtered Influencer Data:', influencerData);

				// Merge influencer data with basic user info
				influencers.push({
					id: userId,
					...userDoc.data(),
					...influencerData
				});
			});
		}

		// Log the final influencers array
		console.log('Final Influencers Array:', influencers);

		return influencers;
	} catch (error) {
		console.error('Error fetching influencers:', error);
		throw error;
	}
};
