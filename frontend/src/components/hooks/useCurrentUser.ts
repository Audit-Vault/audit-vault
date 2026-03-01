import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCurrentUser() {
	return useQuery({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/current-user`,
				{ withCredentials: true }
			);

			return response.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: false // Disable retry on error if you want to avoid repeated toasts
	});
}
