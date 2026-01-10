import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/ThemeProvider";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="morocco-desert-theme">
    <App />
  </ThemeProvider>
);
