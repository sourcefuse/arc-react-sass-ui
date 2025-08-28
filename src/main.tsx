import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "Components/ErrorBoundary/ErrorBoundary";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <AppWrapper />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);
