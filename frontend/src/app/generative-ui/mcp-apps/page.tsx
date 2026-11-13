import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// The page's two transport examples, verbatim (config fragments).
const HTTP_SERVER = `{
  type: "http",
  url: "http://localhost:3101/mcp",
  serverId: "my-http-server"
}`;

const SSE_SERVER = `{
  type: "sse",
  url: "https://mcp.example.com/sse",
  headers: {
    "Authorization": "Bearer token"
  },
  serverId: "my-sse-server"
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          MCP servers whose tools come with UI resources. The runtime attaches{" "}
          <code>MCPAppsMiddleware</code> to the agent; when the agent calls one
          of those tools, the chat fetches the server&apos;s UI and renders it
          in a sandboxed iframe — no frontend code. The page&apos;s route
          wires the Excalidraw MCP server onto the deep agent (
          <code>LangGraphAgent</code>, graph <code>sample_agent</code>).
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Draw a simple flowchart of a login process in Excalidraw"]}
            expect="The agent calls an Excalidraw MCP tool and an interactive Excalidraw canvas renders inline in the chat."
            fail="A plain-text reply with no tool call (the MCP tools never reached the model), a 404/connection error (LANGGRAPH_DEPLOYMENT_URL unset, so the page's :8123 fallback is used), or an MCP fetch error from mcp.excalidraw.com."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Harness changes and things the page doesn't say">
        <ul className="space-y-1">
          <li>
            · Mounted at <code>/api/copilotkit-mcp-apps</code> (with a matching{" "}
            <code>basePath</code>) rather than replacing the shared runtime;
            the demo nests a <code>CopilotKitProvider</code> pointing there.
          </li>
          <li>
            · The page falls back to <code>http://localhost:8123</code>; this
            repo&apos;s agent server is on 8124. Set{" "}
            <code>LANGGRAPH_DEPLOYMENT_URL</code>.
          </li>
          <li>
            · The page never says to install{" "}
            <code>@ag-ui/mcp-apps-middleware</code>; it resolves here only as
            a dependency of <code>@copilotkit/runtime</code>.
          </li>
          <li>
            · The route exports only <code>GET</code> and <code>POST</code>.
          </li>
        </ul>
      </Callout>

      <Panel title="The runtime route (page code)">
        <SourceCode file="frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" region="mcp-apps-runtime" />
      </Panel>

      <Panel title="Transport types (page fragments)">
        <div className="space-y-4">
          <CodeBlock filename="HTTP transport" language="ts" code={HTTP_SERVER} />
          <CodeBlock filename="SSE transport" language="ts" code={SSE_SERVER} />
        </div>
      </Panel>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
