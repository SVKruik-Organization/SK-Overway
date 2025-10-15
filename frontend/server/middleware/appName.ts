import { AppTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";
import { getAppPreset } from "~/utils/settings";

export default defineEventHandler(async (event) => {
    try {
        if (!event.path.startsWith("/api/auth/")) return;
        const requestUrl = event.path.replace("/api/auth/", ""); // 'overway/login/email'
        const split = requestUrl.split('/');
        if (split.length < 2) throw new Error("The specified application does not exist.", { cause: { statusCode: 1404 } });

        const appName = split[0] as AppTypes | undefined; // 'overway'
        if (!appName || !Object.values(AppTypes).includes(appName)) throw new Error("The specified application does not exist.", { cause: { statusCode: 1404 } });

        const action = split[1]; // 'login' || '2fa'
        const method = split[2]; // 'email' || 'guest'
        if (action === "login" && method === "guest" && !getAppPreset(appName)?.guestLoginEnabled) throw new Error("Guest login is not enabled for this application.", { cause: { statusCode: 1403 } });
    } catch (error: any) {
        throw formatApiError(error);
    }
});