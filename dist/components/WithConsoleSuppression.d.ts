import React from "react";
export type ConsoleType = "log" | "warn" | "error" | "debug" | "info";
interface ConsoleSuppressionProps {
    children: React.ReactNode;
    suppress?: ConsoleType[];
    suppressInDev?: boolean;
    suppressInProd?: boolean;
}
export declare const WithConsoleSuppression: React.FC<ConsoleSuppressionProps>;
export {};
