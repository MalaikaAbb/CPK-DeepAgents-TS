"use client";

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * MCP Apps demo. The page needs no frontend code ("zero frontend code"), so
 * this is only a chat pointed at the page's runtime, mounted here at
 * `/api/copilotkit-mcp-apps`.
 *
 * NOT FROM THE DOC PAGE: the nested `CopilotKitProvider` (the root provider
 * points at `/api/copilotkit`, which has no MCP middleware) with
 * `useSingleEndpoint={false}` for the multi-route handler, and the chat's
 * `agentId`.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/mcp-apps" subtitle="agent: sample_agent + MCPAppsMiddleware (excalidraw)">
      <CopilotKitProvider runtimeUrl="/api/copilotkit-mcp-apps" useSingleEndpoint={false}>
        <div className="h-full">
          <CopilotChat agentId="sample_agent" />
        </div>
      </CopilotKitProvider>
    </DemoFrame>
  );
}
