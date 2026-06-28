import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Toaster
  position="top-center"
  toastOptions={{
    duration: 2500,
    style: {
      borderRadius: "18px",
      background: "#0f172a",
      color: "#fff",
      fontWeight: "800",
      fontSize: "13px",
    },
    success: {
      iconTheme: {
        primary: "#0891b2",
        secondary: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#dc2626",
        secondary: "#fff",
      },
    },
  }}
/>
  </BrowserRouter>
  
);