import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import axios from "axios";

interface UseGoogleAuthHook {
	googleSignInMutation: () => Promise<string | void>;
}

export default function useGoogleAuth(): UseGoogleAuthHook {
	const handleGoogleSignIn = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const token = await result.user.getIdToken();
			return token;
		} catch (error: any) {
			console.error("Google Sign-In Error:", error);
			// Provide more specific error messages
			if (error.code === 'auth/popup-blocked') {
				throw new Error('Popup was blocked. Please allow popups for this site.');
			} else if (error.code === 'auth/popup-closed-by-user') {
				throw new Error('Sign-in cancelled. Please try again.');
			} else if (error.code === 'auth/cancelled-popup-request') {
				throw new Error('Another sign-in popup is already open.');
			}
			throw error;
		}
	};

	const googleSignInMutation = async () => {
		try {
			const token = await handleGoogleSignIn();

			if (!token) {
				console.error("No token generated from Firebase");
				return;
			}

			await axios.post(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/google/sign-in`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`
					},
					withCredentials: true
				}
			);
		} catch (error: any) {
			console.error("Error during Google sign-in mutation:", error);
			throw error; // Re-throw to allow UI to handle the error
		}
	};

	return { googleSignInMutation };
}
