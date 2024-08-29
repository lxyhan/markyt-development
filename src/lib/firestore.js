import {
	getFirestore,
	collection,
	doc,
	setDoc,
	updateDoc,
	query,
	where,
	getDoc,
	getDocs,
	writeBatch
} from 'firebase/firestore';
import { db } from '$lib/firebase.js';

// Fetch user information with optimized structure
// Fetch user information with optimized structure
export const getUserInfo = async (userId) => {
	try {
		const userDoc = await getDoc(doc(db, 'users', userId));
		if (!userDoc.exists()) {
			throw new Error('No user found with the given ID');
		}

		const userInfo = userDoc.data();
		let specificInfo = null;

		if (userInfo.userType === 'business') {
			const businessInfoDoc = await getDoc(doc(db, 'users', userId, 'businessInfo', 'details'));
			specificInfo = businessInfoDoc.exists() ? businessInfoDoc.data() : {}; // Return an empty object if not found
		} else if (userInfo.userType === 'influencer') {
			const influencerInfoDoc = await getDoc(doc(db, 'users', userId, 'influencerInfo', 'details'));
			specificInfo = influencerInfoDoc.exists() ? influencerInfoDoc.data() : {}; // Return an empty object if not found
		}

		return {
			...userInfo,
			// Ensuring the specific info object is returned even if it's empty
			...(userInfo.userType === 'business' ? { businessInfo: specificInfo } : {}),
			...(userInfo.userType === 'influencer' ? { influencerInfo: specificInfo } : {})
		};
	} catch (error) {
		console.error('Error retrieving user info:', error);
		throw error;
	}
};

// Edit user information more efficiently
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
				createdAt: userInfo.createdAt || new Date().toISOString(),
				userType: userInfo.userType // Ensure the userType is saved
			},
			{ merge: true }
		);

		// Handle influencer-specific information if the user is an influencer
		if (userInfo.userType === 'influencer') {
			const influencerRef = doc(db, 'users', userId, 'influencerInfo', 'details');
			await setDoc(
				influencerRef,
				{
					socialMediaHandles: userInfo.influencerInfo.socialMediaHandles,
					niche: userInfo.influencerInfo.niche
				},
				{ merge: true }
			);
			console.log('Updated influencer info:', userInfo.socialMediaHandles, userInfo.niche);
		}

		// Handle business-specific information if the user is a business
		if (userInfo.userType === 'business') {
			console.log('passed');
			const businessRef = doc(db, 'users', userId, 'businessInfo', 'details');
			await setDoc(
				businessRef,
				{
					website: userInfo.businessInfo.website, // If 'website' field is used
					niche: userInfo.businessInfo.niche
				},
				{ merge: true }
			);
			console.log('Updated business info:', userInfo.socialMediaHandles, userInfo.niche);
		}

		console.log('User information updated successfully');
	} catch (error) {
		console.error('Error updating user info:', error);
		throw error;
	}
};

// Get matched influencers or businesses
export const getMatches = async (userType, filters = {}) => {
	try {
		// Reference to the users collection
		const usersRef = collection(db, 'users');
		let q = query(usersRef, where('userType', '==', userType));

		// Apply filters
		if (filters.niche) q = query(q, where('niche', '==', filters.niche));
		if (filters.location) q = query(q, where('location', '==', filters.location));
		if (filters.minFollowers) q = query(q, where('followers', '>=', filters.minFollowers));

		// Execute the query to get matched users
		const snapshot = await getDocs(q);
		const matches = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));

		// console.log('Matches:', matches);
		return matches;
	} catch (error) {
		// console.error('Error fetching matches:', error);
		throw error;
	}
};

// Create matches for a business if none exist
export const createMatches = async (businessId) => {
	try {
		const businessRef = doc(db, 'users', businessId);
		const businessDoc = await getDoc(businessRef);
		const influencers = await getMatches('influencer');

		// Assuming we are just picking the first three influencers for simplicity
		const selectedInfluencers = influencers.slice(0, 3);

		// Save the matches
		const matchesRef = collection(db, 'users', businessId, 'matches');
		const batch = writeBatch(db);

		selectedInfluencers.forEach((influencer) => {
			const matchRef = doc(matchesRef, influencer.id);
			batch.set(matchRef, influencer);
		});

		// Commit batch
		await batch.commit();

		// console.log('Created matches:', selectedInfluencers);
		return selectedInfluencers;
	} catch (error) {
		console.error('Error creating matches:', error);
		throw error;
	}
};

export const getInfluencerMatches = async (influencerId) => {
	try {
		// Step 1: Get all businesses
		const usersRef = collection(db, 'users');
		const q = query(usersRef, where('userType', '==', 'business'));
		const businessSnapshot = await getDocs(q);

		const matchedBusinesses = [];

		// Step 2: Loop through businesses and check matches sub-collection
		for (const businessDoc of businessSnapshot.docs) {
			const matchesRef = collection(db, 'users', businessDoc.id, 'matches');
			const matchesSnapshot = await getDocs(matchesRef);

			// console.log(
			// 	'Matches for Business:',
			// 	businessDoc.id,
			// 	matchesSnapshot.docs.map((doc) => doc.data())
			// );

			for (const matchDoc of matchesSnapshot.docs) {
				if (matchDoc.id === influencerId) {
					matchedBusinesses.push({ id: businessDoc.id, ...businessDoc.data() });
					break; // No need to check further once a match is found
				}
			}
		}

		console.log('Matched Businesses:', matchedBusinesses);
		return matchedBusinesses;
	} catch (error) {
		console.error('Error fetching influencer matches:', error);
		throw error;
	}
};
