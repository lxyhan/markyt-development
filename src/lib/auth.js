import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

export const signInWithGoogle = async (userType) => {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		// Create or overwrite the user document in Firestore
		const userDocRef = doc(db, 'users', user.uid);
		await setDoc(userDocRef, {
			email: user.email,
			name: user.displayName || '', // Use an empty string if the name is not available
			userType: userType, // Set the user type provided during sign-up
			createdAt: new Date().toISOString(),
			profileComplete: false // Initially, set profileComplete to false
		});

		// Return user for further processing
		return user;
	} catch (error) {
		console.error('Error during Google sign-in:', error);
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

export const sendPasswordReset = async (email) => {
	const auth = getAuth();
	try {
		await sendPasswordResetEmail(auth, email);
		console.log('Password reset email sent!');
	} catch (error) {
		console.error('Error sending password reset email:', error);
		throw error;
	}
};
