import { defineStore } from "pinia";
import type { User } from "#auth-utils";

export const useUserStore = defineStore("userStore", {
    state: () => {
        return {
            user: null as User | null,
        };
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },
    actions: {
        setUser(user: User | null): void {
            this.user = user;
        },
        async signOut(): Promise<void> {
            if (!this.isLoggedIn) return;
            const { clear: clearSession } = useUserSession();

            useNotificationStore().clear();

            this.setUser(null);
            await clearSession();
        },
    },
    getters: {
        isLoggedIn(): boolean {
            return !!this.user?.id;
        },
    },
});
