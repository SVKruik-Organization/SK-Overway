// Website settings and configuration

import { AppTypes, NotificationTypes } from "~/assets/customTypes";

const config = useRuntimeConfig();


/**
 * Returns an array of notification types that should not be shown nor persisted.
 * This does not prohibit sending them to the client.
 * @returns An array of notification types that should be excluded.
 */
export function getNotificationExclusions(): Array<NotificationTypes> {
    return [
        NotificationTypes.initialize,
        NotificationTypes.acknowledge,
    ];
}

// Preset configurations for different applications
const appPresets: Record<AppTypes, {
    name: string;
    userTitle: string;
    redirectUrl: string;
    guestLoginEnabled: boolean;
}> = {
    overway: {
        name: "Overway",
        userTitle: "User",
        redirectUrl: config.public.appRedirectOverway,
        guestLoginEnabled: false,
    },
    administrator: {
        name: "SK Administrator",
        userTitle: "Administrator",
        redirectUrl: config.public.appRedirectAdministrator,
        guestLoginEnabled: true,
    },
    platform: {
        name: "SK Platform",
        userTitle: "User",
        redirectUrl: config.public.appRedirectPlatform,
        guestLoginEnabled: false,
    },
    commander: {
        name: "SK Commander",
        userTitle: "Operator",
        redirectUrl: config.public.appRedirectCommander,
        guestLoginEnabled: false,
    },
    docs: {
        name: "SK Docs",
        userTitle: "Reader",
        redirectUrl: config.public.appRedirectDocs,
        guestLoginEnabled: false,
    },
}

/**
 * Get the preset configuration for the current app.
 * @returns The preset configuration object.
 */
export function getAppPreset(overwrite: AppTypes | undefined = undefined): {
    name: string;
    userTitle: string;
    redirectUrl: string;
    guestLoginEnabled: boolean;
} | undefined {
    if (overwrite) return appPresets[overwrite];
    const route = useRoute();
    const appName = route.params.app as string | undefined;
    if (!appName) return appPresets.overway;
    return appPresets[appName as keyof typeof appPresets] || appPresets.overway;
}