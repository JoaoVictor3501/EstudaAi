import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { EditaisProvider } from "./context/EditaisContext";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EditaisProvider>
          <App />
        </EditaisProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
