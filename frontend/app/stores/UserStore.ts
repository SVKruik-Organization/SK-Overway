import type { UserData } from "~/assets/customTypes";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => {
        return {
            user: null as UserData | null,
        };
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
    actions: {
        setUser(userData: UserData | null): void {
            this.user = userData;
        },
        async signOut(): Promise<void> {
            if (!this.isLoggedIn) return;
            const { clear: clearSession } = useUserSession();

            useNotificationStore().clear();

            this.setUser(null);
            clearSession();
        },
    },
    getters: {
        isLoggedIn(): boolean {
            return !!this.user?.id;
        },
    },
});
