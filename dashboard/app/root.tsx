import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { css } from "styled-system/css";
import { RepositoryProvider } from "~/hooks/use-repository";
import { SessionProvider } from "~/hooks/use-session";
import { ToastProvider } from "~/hooks/use-toast/toast-provider";
import stylesheet from "./app.css?url";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+JP:wght@100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export const meta = () => [
  { title: "MaxiCloud Dashboard" },
  {
    name: "description",
    content:
      "MaxiCloud は学内向けPaaSです。Dockerfileベースでサービスをデプロイするための管理ダッシュボードUI。",
  },
  { name: "robots", content: "noindex, nofollow" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={css({
          backgroundGradient: "primary",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
        })}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App() {
  return (
    <RepositoryProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <SessionProvider>
            <Outlet />
          </SessionProvider>
        </ToastProvider>
      </QueryClientProvider>
    </RepositoryProvider>
  );
}
