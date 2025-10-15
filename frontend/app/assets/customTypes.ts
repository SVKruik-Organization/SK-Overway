export enum AppTypes {
    OVERWAY = "overway",
    ADMINISTRATOR = "administrator",
    PLATFORM = "platform",
    COMMANDER = "commander",
    DOCS = "docs",
}

// Login Response
export type UserData = {
    "id": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "type": UserTypes,
    "imageName": string,
    "language": Languages,
}

export enum UserTypes {
    USER = "User",
    GUEST = "Guest",
}

export enum Languages {
    EN = "en",
    NL = "nl",
    // KR = "kr",
}

// Pop-up Item
export type PopupItem = {
    "id": string,
    "type": PromptTypes,
    "message": string,
    "duration": number
}

// Prompt/Informational Message Types
export enum PromptTypes {
    info = "info",
    success = "success",
    warning = "warning",
    danger = "danger"
}

export type NotificationItem = {
    "user_id": number;
    "type": NotificationTypes;
    "level": PromptTypes;
    "data": {
        "message": string;
        "details"?: string;
    };
    "url": string;
    "source": string;
    "is_read": boolean;
    "is_silent": boolean;
    "ticket": string;
    "date_expiry": Date;
    "date_creation": Date;
};

export type DateFormat = {
    "date": string,
    "time": string,
    "today": Date
}

export enum LogTypes {
    info = "INFO",
    warning = "WARNING",
    alert = "ALERT",
    error = "ERROR",
    fatal = "FATAL",
    none = "NONE",
}

export enum CronJobTypes {
}

// Uplink Network Payload
export type UplinkMessage = {
    sender: string;
    recipient: string;
    triggerSource: string;
    reason: string;
    task: string;
    content: string;
    timestamp: Date;
};

export enum NotificationTypes {
    initialize = "initialize",
    acknowledge = "ack",
}

export type LoginResponse = {
    "user": UserData,
}