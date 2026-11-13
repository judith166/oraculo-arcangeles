import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/nunito-sans";
import "./estilos/base.css";
import "./estilos/app.css";
import { App } from "./App";

createRoot(document.getElementById("raiz")!).render(<StrictMode><App /></StrictMode>);
