import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '$lib/firebase.js';

export const signIn = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		return userCredential.user; // Signed-in user
	} catch (error) {
		console.error('Error signing in:', error);
		throw error;
	}
};

export const signUp = async (email, password, userType, name) => {
	try {
		// Create a new user with email and password
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		// Store additional user info in Firestore
		await setDoc(doc(db, 'users', user.uid), {
			email: user.email,
			name: name,
			userType: userType,
			createdAt: new Date().toISOString()
		});

		return user;
	} catch (error) {
		console.error('Error signing up:', error);
		throw error;
	}
};

export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	try {
		const result = await signInWithPopup(auth, provider);
		return result.user; // Signed-in user
	} catch (error) {
		console.error('Error signing in with Google:', error);
		throw error;
	}
};

export const logout = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error('Error signing out:', error);
		throw error;
	}
};

export const authStateListener = (callback) => {
	return onAuthStateChanged(auth, (user) => {
		callback(user); // Pass the user or null if logged out
	});
};
