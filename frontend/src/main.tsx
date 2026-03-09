import "./index.css";

import { Amplify } from "aws-amplify";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Configure Amplify before rendering
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "",
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
