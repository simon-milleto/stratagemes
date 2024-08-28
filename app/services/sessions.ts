// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import { SESSION_TIMEOUT } from "~/game/constants";

type SessionData = {
    userId: string;
    username: string;
    lastRoomId: string;
};

type SessionFlashData = {
    error: string;
};

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData, SessionFlashData>(
        {
            cookie: {
                name: "__session",

                // all of these are optional
                // Expires can also be set (although maxAge overrides it when used in combination).
                // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
                //
                // expires: new Date(Date.now() + 60_000),
                httpOnly: true,
                maxAge: SESSION_TIMEOUT,
                path: "/",
                sameSite: "lax",
                secrets: ["s3cret1"],
                secure: true,
            },
        }
    );

export { getSession, commitSession, destroySession };