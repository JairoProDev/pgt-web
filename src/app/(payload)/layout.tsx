/* Payload generated this file; the unauthenticated branch is ours.
   Next 16 + Payload 3.88 leaves /admin blank without a session
   (github.com/payloadcms/payload/issues/17545). Skip RootLayout until login. */
import config from "@payload-config";
import "@payloadcms/next/css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";

import { getCmsSession } from "@/lib/cms-session";
import { importMap } from "./admin/importMap.js";
import "./custom.css";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const Layout = async ({ children }: Args) => {
  const session = await getCmsSession();

  if (!session.ok || !session.user) {
    return (
      <html lang="es">
        <body style={{ margin: 0 }}>{children}</body>
      </html>
    );
  }

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
};

export default Layout;
