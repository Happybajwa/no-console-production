// src/index.d.ts
declare module "no-console-production" {
    type ConsoleType = "log" | "warn" | "error" | "debug" | "info";

    interface WithConsoleSuppressionProps {
        children: React.ReactNode;
        suppress?: ConsoleType[];
    }

    export const WithConsoleSuppression: React.FC<WithConsoleSuppressionProps>;
}
