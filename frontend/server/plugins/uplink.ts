import { logError } from "@svkruik/sk-platform-formatters";
import { mountUplink } from "@svkruik/sk-uplink-connector";

/**
 * Uplink is a RabbitMQ consumer that listens for messages from the Uplink network.
 * It is used to receive deployment tasks and execute them on the server.
 * 
 * @see https://github.com/SVKruik-Organization/Uplink
 */
export default defineNitroPlugin(async (_nitroApp) => {
    try {
        const runtimeConfig = useRuntimeConfig();
        await mountUplink(undefined, undefined, {
            "host": runtimeConfig.uplinkHost,
            "port": runtimeConfig.uplinkPort,
            "username": runtimeConfig.uplinkUsername,
            "password": runtimeConfig.uplinkPassword,
            "exchangeName": runtimeConfig.uplinkExchange,
            "routingKey": runtimeConfig.uplinkRouter
        });
    } catch (error: any) {
        logError(error);
    }
});