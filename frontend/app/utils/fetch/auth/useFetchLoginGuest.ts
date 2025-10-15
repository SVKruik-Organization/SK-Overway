import type { UserData } from "~/assets/customTypes";
/**
 * Create a new session for a guest user with a code.
 * @param code The guest code.
 * @returns The status of the operation.
 * @throws An error if the request fails.
 */
export const useFetchLoginGuest = async (code: string): Promise<UserData> => {
    try {
        const data = await $fetch(`/api/auth/${useRoute().params.app}/login/guest`, {
            method: "POST",
            body: {
                code
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (typeof data === "boolean") return data;
        const { fetch: fetchSession } = useUserSession();
        await fetchSession();
        return data;
    } catch (error: any) {
        throw formatError(error);
    }
}