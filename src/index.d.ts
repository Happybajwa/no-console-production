// src/index.d.ts
declare module "no-console-production" {
    type ConsoleType = "log" | "warn" | "error" | "debug" | "info";

    interface ConsoleSuppressionOptions {
        suppress?: ConsoleType[];
        suppressAllInDev?: boolean;
        suppressAllInProd?: boolean;
    }

    export const suppressConsole: (options?: ConsoleSuppressionOptions) => void;
}
