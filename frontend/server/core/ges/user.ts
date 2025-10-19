import { Pool } from "mariadb/*";
import { Languages, UserTypes } from "~/assets/customTypes";
import { H3Event } from "h3";
import { sendMail } from "../gmd/sendMail";

type LoginConfig = {
    disableEndConnection?: boolean; // true to disable ending the DB connection after login
    disableSendMail?: boolean; // true to disable sending login notification email
}

export class UserEntity {
    id: number | null = null;
    email: string | null = null;
    appName: string;
    database: Pool;

    constructor(id: number | null, email: string | null, appName: string, database: Pool) {
        this.id = id;
        this.email = email;
        this.appName = appName;
        this.database = database;
    }

    async fetch(mode: "login" | "system"): Promise<void> {
        if (this.id === null && this.email === null) throw new Error("Either ID or email must be provided to fetch user.", { cause: { statusCode: 1400 } });

        const response: Array<{
            "id": number,
            "email": string,
        }> = await this.database.query("SELECT id, email FROM user WHERE id = ? OR email = ?;", [this.id, this.email]);

        if (response.length === 0) {
            if (mode === "login") {
                throw new Error("Email or password is incorrect. Please check your credentials and try again.", { cause: { statusCode: 1401 } });
            } else throw new Error("User not found.", { cause: { statusCode: 1404 } });
        }

        this.id = response[0].id;
        this.email = response[0].email;
    }

    async login(event: H3Event, config?: LoginConfig): Promise<void> {
        if (this.id === null && this.email === null) throw new Error("Either ID or email must be provided to fetch user.", { cause: { statusCode: 1400 } });

        // Fetch additional PII
        const additionalData: Array<{
            "id": number,
            "first_name": string,
            "last_name": string,
            "email": string,
            "image_name": string,
        }> = await this.database.query("SELECT id, first_name, last_name, email, image_name FROM user WHERE id = ? OR email = ?;", [this.id, this.email]);
        if (!additionalData.length) throw new Error("Email or password is incorrect. Please check your credentials and try again.", { cause: { statusCode: 1401 } });
        this.id = additionalData[0].id;
        this.email = additionalData[0].email;

        // Send new login email
        if (!config?.disableSendMail) await sendMail(this.email, "New Login", [
            { "key": "firstName", "value": additionalData[0].first_name || "user" },
            { "key": "platformName", "value": this.appName },
        ], "new-login");

        // Create the session
        await createUserSession(event, {
            "id": this.id,
            "firstName": additionalData[0].first_name,
            "lastName": additionalData[0].last_name,
            "email": this.email,
            "type": UserTypes.USER,
            "imageName": additionalData[0].image_name,
            "language": Languages.EN
        }, this.database);

        if (!config?.disableEndConnection) await this.database.end();
    }
}