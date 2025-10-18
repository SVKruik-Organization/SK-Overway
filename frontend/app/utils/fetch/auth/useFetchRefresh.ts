import type { LoginResponse } from "~/assets/customTypes";

/**
 * Refresh an existing user session.
 * @returns The status of the operation.
 * @throws An error if the request fails.
 */
export const useFetchRefreshSession = async (): Promise<LoginResponse> => {
    try {
        const data = await $fetch(`/api/auth/${useRoute().params.app}/refresh`, {
            method: "PUT",
        });
        const { fetch: fetchSession } = useUserSession();
        await fetchSession();
        return data;
    } catch (error: any) {
        throw formatError(error);
    }
}