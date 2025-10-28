import { defineCronHandler } from "#nuxt/cron"
import { Pool } from "mariadb";

export default defineCronHandler("hourly", async () => {
    try {
        const connection: Pool = await database("central");
        await connection.query("DELETE FROM user_session WHERE date_expiry < CURRENT_TIMESTAMP;");

        log(`[CRON / Hour] Completed data cleaning process.`, "info");
    } catch (error: any) {
        logError(error);
    }
});