"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const WithConsoleSuppression_1 = require("../components/WithConsoleSuppression");
const TestComponent = () => {
    console.log("This log should be suppressed");
    console.warn("This warning should be suppressed");
    console.error("This error should also be suppressed");
    console.info("This info message should be suppressed");
    return react_1.default.createElement("div", null, "Test Component is running");
};
// Playground App component to render the TestComponent
const App = () => (react_1.default.createElement(WithConsoleSuppression_1.WithConsoleSuppression, { suppress: ["log", "warn", "error"] },
    react_1.default.createElement(TestComponent, null)));
// Render the playground component
const root = client_1.default.createRoot(document.getElementById("root"));
root.render(react_1.default.createElement(App, null));
