
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import pawsIcon from "./paws.png";
import "./index.css";

const ensureFavicon = () => {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (existing) {
    existing.href = pawsIcon;
    existing.type = "image/png";
    return;
  }

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = pawsIcon;
  document.head.appendChild(link);
};

createRoot(document.getElementById("root")!).render(<App />);

ensureFavicon();
  
