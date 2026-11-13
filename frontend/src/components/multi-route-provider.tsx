"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

/**
 * The Intelligence Quickstart's "Connect your frontend" step as printed since
 * the 2026-11 doc sync: `runtimeUrl="/api/copilotkit"` with
 * `useSingleEndpoint={false}`, against the multi-route `[[...slug]]` handler
 * the same page now mounts (this repo's main `/api/copilotkit` mount).
 *
 * Nested inside the app-wide `Providers` on `/intelligence/quickstart/demo-chat`
 * only, so the provider under test is the page's own `CopilotKitProvider`
 * rather than the root `<CopilotKit>`.
 *
 * NOT FROM THE DOC PAGE: `headers`. The page leaves auth to "your existing
 * application authentication headers or session"; this harness's
 * `identifyUser` keys threads on `x-user-id` / `x-user-name`, so the same fixed
 * demo identity the root provider sends is passed here. The page's commented
 * `// Native runtime: ...` lines are for the Python/Go/Ruby/.NET tabs and do
 * not apply to this TypeScript runtime.
 */
export function MultiRouteProvider({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit"
      useSingleEndpoint={false}
      headers={{
        "x-user-id": process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "harness-local",
        "x-user-name": process.env.NEXT_PUBLIC_DEMO_USER_NAME ?? "Harness User",
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
