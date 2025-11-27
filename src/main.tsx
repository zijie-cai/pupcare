
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import pupcareIcon from "./pupcare_icon.png";
import "./index.css";

const ensureFavicon = () => {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (existing) {
    existing.href = pupcareIcon;
    existing.type = "image/png";
    return;
  }

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = pupcareIcon;
  document.head.appendChild(link);
};

createRoot(document.getElementById("root")!).render(<App />);

ensureFavicon();
  
