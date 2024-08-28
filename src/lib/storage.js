import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase Storage
const storage = getStorage();

export const uploadProfilePicture = async (userId, file, fileType) => {
	try {
		// Determine the storage reference based on the file type
		let folderPath = 'profilePictures';
		if (fileType === 'bannerPicture') {
			folderPath = 'bannerPictures';
		}

		// Create a storage reference based on the file type
		const storageRef = ref(storage, `${folderPath}/${userId}`);

		// Upload the file to Firebase Storage
		const snapshot = await uploadBytes(storageRef, file);

		// Get the download URL for the uploaded file
		const downloadURL = await getDownloadURL(snapshot.ref);

		console.log(`${fileType} uploaded successfully:`, downloadURL);
		return downloadURL;
	} catch (error) {
		console.error(`Error uploading ${fileType}:`, error);
		throw error;
	}
};
