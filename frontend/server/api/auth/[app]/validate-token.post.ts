import type { Pool } from "mariadb";
import { database } from "#imports";
import { z } from "zod";
import { formatApiError } from "~/utils/format";
import { UserTypes } from "~/assets/customTypes";

// Validation schema for the request body
const bodySchema = z.object({
    token: z.string(),
});

/**
 * Submit the 2FA code for verification
 * If successful, creates a session for the user
 * @returns The user info and session information.
 */
export default defineEventHandler(async (event): Promise<{
    "object_id": number;
    "object_type": UserTypes;
}> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { token } = parseResult.data;

        // Retrieve the user ID from the database
        const connection: Pool = await database("central");
        const response: Array<Array<{
            "object_id": number;
            "object_type": UserTypes;
        }>> = await connection.query(`
            SELECT object_id, object_type FROM user_session WHERE token = ? AND date_expiry > CURRENT_TIMESTAMP;
            UPDATE user_session SET date_last_usage = CURRENT_TIMESTAMP WHERE token = ?;`,
            [token, token]);
        // response[1] is the result of the UPDATE query.

        if (!response.length || !response[0].length) throw new Error("The provided token is invalid or has expired. Please check your credentials and try again.", { cause: { statusCode: 1401 } });
        return response[0][0];
    } catch (error: any) {
        throw formatApiError(error);
    }
});