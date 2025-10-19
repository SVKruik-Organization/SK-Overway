/**
 * Refresh an existing user session.
 * @returns The status of the operation.
 * @throws An error if the request fails.
 */
export const useFetchRefreshSession = async (): Promise<void> => {
    try {
        await $fetch(`/api/auth/${useRoute().params.app}/refresh`, {
            method: "PUT",
        });
        await useUserSession().fetch();
    } catch (error: any) {
        throw formatError(error);
    }
}