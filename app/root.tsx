import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const themes = [
  "raccoon_retreat_night",
  "raccoon_retreat",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

const formatThemeName = (theme: string) =>
  theme
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function Layout({ children }: { children: React.ReactNode }) {
  const [selectedTheme, setSelectedTheme] = useLocalStorage("theme", "system");
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updatePreference = (event: MediaQueryList | MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    updatePreference(mediaQuery);
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const resolvedTheme =
    selectedTheme === "system"
      ? prefersDark
        ? "raccoon_retreat_night"
        : "raccoon_retreat"
      : selectedTheme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="drawer z-50">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content fixed top-10">
            {/* Page content here */}
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button rounded-s-none"
            >
              <i className="icon-paint-brush text-2xl"></i>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              {themes.map((theme) => (
                <li key={theme}>
                  <input
                    type="radio"
                    name="theme-buttons"
                    className="btn theme-controller join-item"
                    aria-label={formatThemeName(theme)}
                    value={theme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container mx-auto">
          {children}
          <ScrollRestoration />
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div className="flex justify-center align-middle py-28">
      <div className="animate-spin">
        <i className="icon-dinosaur-bones text-8xl"></i>
      </div>
    </div>
  );
}
