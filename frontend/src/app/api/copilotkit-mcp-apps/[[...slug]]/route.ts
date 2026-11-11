/**
 * MCP Apps — the page's `app/api/copilotkit/[[...slug]]/route.ts`.
 *
 * https://docs.copilotkit.ai/deepagents/generative-ui/mcp-apps
 *
 * Copied as printed, with one harness change: it is mounted at
 * `/api/copilotkit-mcp-apps` (so `basePath` says that) instead of replacing
 * the shared `/api/copilotkit` runtime, because the page attaches
 * `MCPAppsMiddleware` to the agent and every other route's agent must stay
 * untouched. The agent is the page's own `LangGraphAgent` on graph
 * `sample_agent` — the Quickstart deep agent served by the LangGraph server,
 * i.e. this framework's own agent.
 *
 * Note the page's deployment-URL fallback is `http://localhost:8123`, while
 * this repo's agent server listens on 8124 (`backend/package.json`). Set
 * `LANGGRAPH_DEPLOYMENT_URL=http://localhost:8124` in `frontend/.env.local`, or
 * this route reaches whatever owns 8123. Kept as printed (README §9 N15).
 *
 * `@ag-ui/mcp-apps-middleware` is not in `frontend/package.json`; it resolves
 * because `@copilotkit/runtime` 1.72.0 depends on it (0.1.1, hoisted). The
 * page never says to install it.
 */
//#region mcp-apps-runtime
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph"; 
import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware"; 

const agent = new LangGraphAgent({
deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
  graphId: "sample_agent",
langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
});

agent.use(
  new MCPAppsMiddleware({
    mcpServers: [
      {
        type: "http",
        url: "https://mcp.excalidraw.com",
        serverId: "excalidraw",
      },
    ],
  }),
);

const runtime = new CopilotRuntime({
  agents: { sample_agent: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-apps",
});

export const GET = handler;
export const POST = handler;
//#endregion
