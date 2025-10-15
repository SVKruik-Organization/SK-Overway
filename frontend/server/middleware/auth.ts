import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = getRequestURL(event).pathname;
        if (!requestUrl.startsWith("/api")) return;

        const user = (await getUserSession(event)).user;
        const publicPaths = ["/api/status"];

        if (!user && !publicPaths.includes(requestUrl) && !requestUrl.startsWith("/api/auth/"))
            throw new Error("This resource requires authentication.", { cause: { statusCode: 1401 } });
    } catch (error: any) {
        throw formatApiError(error);
    }
});