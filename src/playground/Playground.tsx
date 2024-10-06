import React from "react";
import ReactDOM from "react-dom/client";
import { WithConsoleSuppression } from "../components/WithConsoleSuppression";

const TestComponent: React.FC = () => {
  console.log("This log should be suppressed");
  console.warn("This warning should be suppressed");
  console.error("This error should also be suppressed");
  console.info("This info message should be suppressed");

  return <div>Test Component is running</div>;
};

// Playground App component to render the TestComponent
const App: React.FC = () => (
  <WithConsoleSuppression suppress={["log", "warn", "error"]}>
    <TestComponent />
  </WithConsoleSuppression>
);

// Render the playground component
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
