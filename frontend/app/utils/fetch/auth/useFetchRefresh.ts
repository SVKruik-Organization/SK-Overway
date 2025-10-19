/**
 * Refresh an existing user session.
 * @returns The token of the created session.
 * @throws An error if the request fails.
 */
export const useFetchRefreshSession = async (): Promise<string> => {
    try {
        const token: string = await $fetch(`/api/auth/${useRoute().params.app}/refresh`, {
            method: "PUT",
        });
        await useUserSession().fetch();
        return token;
    } catch (error: any) {
        throw formatError(error);
    }
}