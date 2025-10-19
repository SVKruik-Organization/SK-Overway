/**
 * Create a new session for a user via email.
 * @param email The email address of the user.
 * @param password The password of the email account.
 * @returns The status of the operation.
 * @throws An error if the request fails.
 */
export const useFetchLoginEmail = async (email: string, password: string): Promise<string> => {
    try {
        return await $fetch(`/api/auth/${useRoute().params.app}/login/email`, {
            method: "POST",
            body: { email, password },
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}