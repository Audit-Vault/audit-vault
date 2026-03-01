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
		} catch (error) {
			console.log(error);
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
		} catch (error) {
			console.error("Error during Google sign-in mutation:", error);
		}
	};

	return { googleSignInMutation };
}
