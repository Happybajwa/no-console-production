"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithConsoleSuppression = void 0;
const react_1 = __importStar(require("react"));
const WithConsoleSuppression = ({ children, suppress, }) => {
    // Store original console methods to restore later
    const originalConsole = (0, react_1.useRef)({
        log: console.log,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        info: console.info,
    });
    if ((suppress === null || suppress === void 0 ? void 0 : suppress.length) === 0 || !suppress) {
        suppress = ["log", "warn", "error", "debug"];
    }
    // Immediately override console methods when component mounts
    suppress.forEach((type) => {
        switch (type) {
            case "log":
                console.log = () => { }; // Suppress log
                break;
            case "warn":
                console.warn = () => { }; // Suppress warn
                break;
            case "error":
                console.error = () => { }; // Suppress error
                break;
            case "debug":
                console.debug = () => { }; // Suppress debug
                break;
            case "info":
                console.info = () => { }; // Suppress info
                break;
            default:
                break;
        }
    });
    // Cleanup effect to restore original console methods on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            console.log = originalConsole.current.log;
            console.warn = originalConsole.current.warn;
            console.error = originalConsole.current.error;
            console.debug = originalConsole.current.debug;
            console.info = originalConsole.current.info;
        };
    }, []);
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
exports.WithConsoleSuppression = WithConsoleSuppression;
