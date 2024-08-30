import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs} from "partymix";
import { json } from "partymix";
import { Analytics } from "@vercel/analytics/react"
import styles from "./index.css?url"

import { SocketConfigContext } from "~/context/SocketContext";
import { v4 as uuidv4 } from 'uuid';

import { getSession, commitSession } from "~/services/sessions";
import { Theme } from "@radix-ui/themes";
import { css } from "styled-system/css";
import Toaster from "~/components/Toast";
import Dialog from "~/components/Dialog";
import { UserContext } from "./context/UserContext";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const host = process.env.PARTYKIT_HOST || "127.0.0.1:1999";

  const session = await getSession(
    request.headers.get("Cookie")
  );

  const userId = session.get("userId") || uuidv4();
  const username = session.get("username") || "New wizard";

  if (!session.has("userId")) {
    session.set("userId", userId);
  }

  return json({
    userId,
    username,
    host,
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function App() {
  const { host, userId, username } = useLoaderData<typeof loader>();

  console.log({ userId, username });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme asChild>
          <main className={css({
            bg: 'dark',
            minH: '100vh',
            width: '100%',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          })}>
            <UserContext.Provider value={{ userId, username }}>
              <SocketConfigContext.Provider value={{ host }}>
                <Outlet />
                <Toaster />
                <Dialog />
              </SocketConfigContext.Provider>
            </UserContext.Provider>
          </main>
        </Theme>
        <Analytics />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <p>Loading...</p>
        <Scripts />
      </body>
    </html>
  );
}