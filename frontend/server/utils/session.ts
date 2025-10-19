import { User, UserSession } from "#auth-utils";
import { randomUUID } from "crypto";
import type { H3Event } from "h3";
import { Pool } from "mariadb";
import { UserTypes } from "~/assets/customTypes";
import { UserEntity } from "../core/ges/user";
import { GuestEntity } from "../core/ges/guest";

/**
 * Creates and returns a user session.
 * Also updates the last login date in the database.
 * 
 * @param event The request event
 * @param user The user data to store in the session 
 * @param connection The database connection to use
 * @returns The user data stored in the session
 */
export async function createUserSession(event: H3Event, user: User, connection: Pool): Promise<User> {
    const userSession: UserSession = await replaceUserSession(event, {
        user: {
            "id": user.id,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "type": user.type,
            "imageName": user.imageName,
            "language": user.language,
        },
        loggedInAt: new Date(),
    }, user.type === UserTypes.GUEST ? {
        maxAge: 60 * 60 * 4, // 4 hours for guests
    } : undefined);

    // Update the last login date in the database
    const tableName: string = user.type === UserTypes.USER ? "user" : "guest";
    await connection.query(`UPDATE ${tableName} SET date_last_login = CURRENT_TIMESTAMP WHERE id = ?;`, [user.id]);

    // Return the user data
    return userSession.user as User;
}

/**
 * Creates a persistent token for the user.
 * 
 * @param user The user data
 * @param connection The database connection to use
 * @returns The created token
 */
export async function createUserToken(user: UserEntity | GuestEntity): Promise<string> {
    const token = randomUUID();
    const type = user instanceof UserEntity ? UserTypes.USER : UserTypes.GUEST;
    await user.database.query(`
        DELETE FROM user_token WHERE object_id = ? AND object_type = ?;
        INSERT INTO user_token (object_id, object_type, token, app_name) VALUES (?, ?, ?, ?);`,
        [user.id, type,
        user.id, type, token, user.appName]);
    return token;
}