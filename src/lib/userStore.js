// src/lib/userStore.js
import { writable } from 'svelte/store';

export const loading = writable(true);

export const userInfo = writable({
	uid: '',
	name: '',
	email: '',
	description: '',
	profileComplete: false,
	profilePicture: '',
	bannerPicture: '',

	province: '',
	city: '',
	postalCode: '',
	companyName: '',
	website: '',
	contactPerson: '',
	socialMediaHandles: '',
	niche: '',
	accountSize: '',
	engagementRate: '',
	accountCategories: [],
	userType: '' // 'business' or 'influencer'
});

// Function to reset userInfo
export const resetUserInfo = () => {
	userInfo.set({
		uid: '',
		name: '',
		email: '',
		description: '',
		profileComplete: false,
		province: '',
		city: '',
		profilePicture: '',
		bannerPicture: '',
		postalCode: '',
		companyName: '',
		website: '',
		contactPerson: '',
		socialMediaHandles: '',
		niche: '',
		accountSize: '',
		engagementRate: '',
		accountCategories: [],
		userType: ''
	});
};
