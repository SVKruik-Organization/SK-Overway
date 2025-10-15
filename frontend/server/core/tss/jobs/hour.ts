import { defineCronHandler } from "#nuxt/cron"

export default defineCronHandler("hourly", async () => {
    try {
        log(`[CRON / Hour] Completed data cleaning process.`, "info");
    } catch (error: any) {
        logError(error);
    }
});