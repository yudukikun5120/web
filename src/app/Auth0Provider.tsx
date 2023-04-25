"use client";

import "client-only";

import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        redirect_uri:
          typeof window === "object" ? window.location.origin : undefined,
        scope: [
          "create:mylist",
          "create:registration_request",
          "edit:mylist",
          "update:mylist_registration",
        ].join(" "),
      }}
    >
      {children}
    </Auth0Provider>
  );
}
