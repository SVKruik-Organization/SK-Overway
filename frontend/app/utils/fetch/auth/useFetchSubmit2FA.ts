/**
 * Submits the 2FA pin for verification.
 * @param email The email of the user.
 * @param pin The 2FA pin to submit.
 * @returns The status of the operation.
 * @throws An error if the request fails.
 */
export const useFetchSubmit2FA = async (email: string, pin: string): Promise<void> => {
    try {
        await $fetch(`/api/auth/${useRoute().params.app}/2fa`, {
            method: "POST",
            body: {
                email,
                pin,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        await useUserSession().fetch();
    } catch (error: any) {
        throw formatError(error);
    }
}