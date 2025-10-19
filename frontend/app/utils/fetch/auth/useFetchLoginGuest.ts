/**
 * Create a new session for a guest user with a code.
 * @param code The guest code.
 * @returns The token of the created session.
 * @throws An error if the request fails.
 */
export const useFetchLoginGuest = async (code: string): Promise<string> => {
    try {
        const token: string = await $fetch(`/api/auth/${useRoute().params.app}/login/guest`, {
            method: "POST",
            body: { code },
            headers: { "Content-Type": "application/json" },
        });
        await useUserSession().fetch();
        return token;
    } catch (error: any) {
        throw formatError(error);
    }
}