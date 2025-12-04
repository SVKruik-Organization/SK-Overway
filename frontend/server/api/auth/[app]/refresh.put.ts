import { formatApiError, formatAppName } from "~/utils/format";
import { UserEntity } from "~~/server/core/ges/user";
import { User } from "#auth-utils";
import { Pool, database } from "@svkruik/sk-platform-db-conn";

/**
 * Refresh an existing user session. Not allowed for guest users.
 * @returns The user info and session information.
 */
export default defineEventHandler(async (event): Promise<string> => {
    try {
        const appName = formatAppName(getRouterParam(event, "app"));
        const userSession: User | undefined = (await getUserSession(event)).user;
        // Caught by middleware, but we double check here
        if (!userSession) throw new Error("This resource requires authentication.", { cause: { statusCode: 1401 } });
        if (!userSession.email) throw new Error("Guest users are not allowed to access this resource.", { cause: { statusCode: 1401 } });

        // Create the user and login
        const connection: Pool = await database("central");
        const user: UserEntity = new UserEntity(null, userSession.email, appName, connection);
        return await user.login(event, {
            disableSendMail: true
        });
    } catch (error: any) {
        throw formatApiError(error);
    }
});