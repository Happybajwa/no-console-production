import React from "react";
import { ConsoleType } from "../interface/ConsoleType";
interface ConsoleSuppressionProps {
    children: React.ReactNode;
    suppress?: ConsoleType[];
    suppressInDev?: boolean;
    suppressInProd?: boolean;
}
export declare const WithConsoleSuppression: React.FC<ConsoleSuppressionProps>;
export {};
