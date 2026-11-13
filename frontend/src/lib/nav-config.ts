/**
 * The nav, the route headers, the status page and the README status table all
 * read from here, so a doc page and its implementation status are described
 * exactly once.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai/deepagents. Every
 * page here was read in its **TypeScript** tab; the Python variants are the
 * sibling repo's job.
 *
 * `agentId` is the graph id in `backend/langgraph.json` that the route drives;
 * routes without one are reference-only and have no agent.
 */

/**
 * There is exactly one doc-sync date in this repo, and it is not here: it is
 * `syncedAt` in `doc-snapshot/manifest.json`, written every time the sync
 * button runs. A hand-maintained date alongside it only ever drifted out of
 * agreement with the machine one, so it was removed — `/doc-sync` is the
 * single place that answers "how current are these docs".
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/deepagents";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export interface RouteMeta {
  path: string;
  title: string;
  /** Path under docs.copilotkit.ai, including any query the page needs. */
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  /** Present but absent from the doc sidebar as of DOC_SYNC_DATE. */
  offNav?: boolean;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
  /** Graph id in backend/langgraph.json, when the route drives one. */
  agentId?: string;
  /** Extra graph ids the route's demo can switch between. */
  extraAgentIds?: string[];
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/deepagents",
        summary: "What this harness covers and how the pieces fit together.",
        status: "reference",
        statusNote: "Landing page — orientation and the live graph roster.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        agentId: "sample_agent",
        title: "Quickstart",
        docPath: "/deepagents/quickstart",
        summary:
          "createDeepAgent with one TypeScript tool, served by the LangGraph dev server and reached through a CopilotRuntime route.",
        status: "working",
      },
    ],
  },
  {
    title: "Basics",
    routes: [
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        agentId: "sample_agent",
        title: "Threads Drawer",
        docPath: "/deepagents/prebuilt-components/copilot-threads-drawer",
        summary:
          "The drop-in conversation sidebar, wired with no active-thread state of its own.",
        status: "working",
        statusNote:
          "Needs the runtime in Intelligence mode, and a license token for the unlocked view — see the Quickstart's connection panel.",
      },
      {
        path: "/prebuilt-components/chat",
        title: "CopilotChat",
        docPath: "/deepagents/prebuilt-components/chat",
        summary: "The base inline chat surface, sized by its container.",
        status: "partial",
        statusNote: "Only the import line is published; the usage example is a missing deepagents::agentic-chat ×2 snippet. The demo mounts <CopilotChat agentId=\"sample_agent\" /> (labelled, not from the page). Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/prebuilt-components/sidebar",
        title: "CopilotSidebar",
        docPath: "/deepagents/prebuilt-components/sidebar",
        summary: "A collapsible chat docked beside the main content, opened by a launcher.",
        status: "partial",
        statusNote: "Only the import line is published; the usage example is a missing deepagents::prebuilt-sidebar ×2 snippet. The demo mounts <CopilotSidebar agentId=\"sample_agent\" /> (labelled, not from the page). Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/prebuilt-components/popup",
        title: "CopilotPopup",
        docPath: "/deepagents/prebuilt-components/popup",
        summary: "A floating launcher that opens an overlay chat window.",
        status: "partial",
        statusNote: "Only the import line is published; the usage example is a missing deepagents::prebuilt-popup snippet. The demo mounts <CopilotPopup agentId=\"sample_agent\" /> (labelled, not from the page). Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/prebuilt-components/chat-controls",
        title: "Open, close, and feedback",
        docPath: "/deepagents/prebuilt-components/chat-controls",
        summary: "Controlling the sidebar's open state from your own UI (open/onOpenChange or setModalOpen) and capturing thumbs-up/down feedback.",
        status: "partial",
        statusNote: "Layout matches aws-strands-ts: one surface with a Popup button, a sidebar toggle and a left sidebar whose thumbs record into a Feedback list. The page's analytics.track (never defined) is replaced by local state. Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/css",
        title: "CSS Customization",
        docPath: "/deepagents/custom-look-and-feel/css",
        summary: "Re-skinning the v2 chat with design-token overrides on [data-copilotkit], .copilotKit* class rules, and the labels prop.",
        status: "partial",
        statusNote: "Token, class/font and labels samples are mounted. The page's own theme.css walkthrough is a missing deepagents::chat-customization-css snippet, and its CopilotKitCSSProperties sample needs the v1 @copilotkit/react-ui package. Not yet browser-checked.",
      },
    ],
  },
  {
    title: "Chat",
    routes: [
      {
        path: "/multimodal-attachments",
        title: "Multimodal Attachments",
        docPath: "/deepagents/multimodal-attachments",
        summary: "CopilotChat's attachments prop: drag-and-drop files, MIME/size limits, custom onUpload (data or URL), upload concurrency and error hooks.",
        status: "partial",
        statusNote: "Frontend-only page, run against sample_agent. Three tabs fail on upload by design: the page uses uploadToStorage, toast and an /api/upload route it never defines. Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/custom-look-and-feel/slots",
        title: "Slots (Subcomponents)",
        docPath: "/deepagents/custom-look-and-feel/slots",
        summary: "CopilotChat slots three ways — Tailwind class string, props object, or replacement component — including nested slots and labels.",
        status: "partial",
        statusNote: "All seven generic samples mounted. The page's worked example is a missing deepagents::chat-slots snippet; CustomToolbar/CustomCopyButton/CustomUserMessage are labelled stand-ins; two samples need @ts-expect-error. Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/custom-look-and-feel/markdown",
        title: "Markdown Rendering",
        docPath: "/deepagents/custom-look-and-feel/markdown",
        summary: "The markdownRenderer slot: per-tag Streamdown components, a class string for the whole block, or a full replacement renderer.",
        status: "partial",
        statusNote: "All three samples mounted as printed; frontend-only, on sample_agent. Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        title: "Headless UI",
        docPath: "/deepagents/custom-look-and-feel/headless-ui",
        summary: "A chat built from useAgent, useCopilotKit and useRenderToolCall with no CopilotChat, up to a full hand-rolled message view.",
        status: "broken",
        statusNote: "Reference-only. Every code cell is a missing deepagents::headless-simple / headless-complete snippet, and the .md export's fences are empty, so there is no code to build from.",
      },
      {
        path: "/custom-look-and-feel/reasoning-messages",
        title: "Reasoning Messages",
        docPath: "/deepagents/custom-look-and-feel/reasoning-messages",
        summary: "Overriding the reasoning card's header, contentView and toggle slots, or its whole layout via a children render function.",
        status: "broken",
        statusNote: "The page's slot components are mounted, but the reasoning agent they need is a missing deepagents::reasoning-* snippet; on sample_agent (gpt-4o) no reasoning card ever appears.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/voice",
        title: "Voice",
        docPath: "/deepagents/voice",
        summary: "Speech-to-text in the chat composer: a runtime transcriptionService makes /info advertise transcription, and CopilotChat grows a mic button.",
        status: "broken",
        statusNote: "Reference-only. All four code cells on the rendered Deep Agents page are 'No demo found for deepagents::voice' — no page, route or transcription service is published.",
      },
      {
        path: "/generative-ui/reasoning",
        title: "Reasoning",
        docPath: "/deepagents/generative-ui/reasoning",
        summary: "Reasoning tokens rendered in the chat: the built-in Thinking card, or a custom messageView.reasoningMessage slot.",
        status: "broken",
        statusNote: "Reference-only. The rendered Deep Agents page shows 'No demo found' for deepagents::reasoning-default and deepagents::reasoning-custom in every code cell, and no reasoning agent is published.",
      },
    ],
  },
  {
    title: "Rich Threads",
    routes: [
      {
        path: "/headless-threads",
        hasDemo: true,
        agentId: "sample_agent",
        title: "Headless Threads",
        docPath: "/deepagents/headless-threads",
        summary:
          "The same thread data through useThreads, with a hand-built list — including rename, which the drawer omits.",
        status: "working",
        statusNote:
          "Needs Intelligence mode. In SSE mode /info reports mutations: false, so rename/archive/delete have no endpoint.",
      },
      {
        path: "/threads-lifecycle",
        hasDemo: true,
        agentId: "sample_agent",
        title: "Thread & History Lifecycle",
        docPath: "/deepagents/threads-lifecycle",
        summary:
          "Where a threadId comes from, how history replays, and how switching differs from starting fresh.",
        status: "working",
        statusNote:
          "Switch/start are live regardless; history replay needs a server-side store to replay from.",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        agentId: "tool_rendering_agent",
        title: "Tool Rendering",
        docPath: "/deepagents/generative-ui/tool-rendering",
        summary:
          "A backend tool call rendered as a custom component with useRenderTool, plus useDefaultRenderTool as the catch-all.",
        status: "working",
      },
      {
        path: "/generative-ui/state-rendering",
        hasDemo: true,
        agentId: "state_rendering_agent",
        title: "State Rendering",
        docPath: "/deepagents/generative-ui/state-rendering",
        summary:
          "A searches list pushed with copilotkitEmitState and read live in the app through useAgent.",
        status: "working",
        statusNote:
          "The page shows the emit loop but not what calls it; the tool wrapper here is written to the shape it describes.",
      },
      {
        path: "/generative-ui/your-components/interrupt-based",
        hasDemo: true,
        agentId: "interrupt_agent",
        extraAgentIds: ["interrupt_multi_agent"],
        title: "Interrupt-based HITL",
        docPath: "/deepagents/generative-ui/your-components/interrupt-based",
        summary:
          "LangGraph interrupt() inside a createMiddleware beforeModel hook, answered in the browser by useInterrupt.",
        status: "working",
        statusNote:
          "Both tabs are the page's code verbatim. The conditional tab was ⚠️ Partial until 04 Sep 2026 on an `enabled` callback destructuring an `eventValue` the event does not carry; that finding has been withdrawn.",
      },
      {
        path: "/generative-ui/mcp-apps",
        title: "MCP Apps",
        docPath: "/deepagents/generative-ui/mcp-apps",
        summary: "MCPAppsMiddleware on the deep agent's LangGraphAgent, so MCP-server tools render their own sandboxed UI in the chat.",
        status: "partial",
        statusNote: "The page's runtime route is mounted verbatim at /api/copilotkit-mcp-apps with the Excalidraw MCP server. Its deployment-URL fallback is :8123 (this repo uses 8124 — set LANGGRAPH_DEPLOYMENT_URL), and @ag-ui/mcp-apps-middleware is only a transitive dependency. Not yet browser-checked.",
        agentId: "sample_agent",
        hasDemo: true,
      },
      {
        path: "/generative-ui/open-generative-ui",
        title: "Open Generative UI",
        docPath: "/deepagents/generative-ui/open-generative-ui",
        summary: "Agent-written HTML/CSS/JS documents streamed into the chat and run in a sandbox, optionally calling back into the app.",
        status: "broken",
        statusNote: "Reference-only. Both setups (minimal and with app tool calling) are missing deepagents::open-gen-ui / open-gen-ui-advanced snippets; only a CDN <script> example is printed.",
        path: "/generative-ui/components",
        hasDemo: true,
        agentId: "components_agent",
        title: "Components and surfaces",
        docPath: "/deepagents/generative-ui/components",
        summary: "Let the agent render your own React components, in the chat and in named areas of the page, through a provider-level generativeUI catalog.",
        status: "partial",
        statusNote: "Live on /api/copilotkit-genui: the page's provider (generativeUI={{ ui: standardUI }}) and chat. The page's TanStack BuiltInAgent is swapped for the components_agent Deep Agents graph (same prompt, no tools). Not yet browser-checked.",
      },
      {
        path: "/generative-ui/components/surfaces",
        hasDemo: true,
        agentId: "components_agent",
        title: "Surfaces",
        docPath: "/deepagents/generative-ui/components/surfaces",
        summary: "Generated UI rendered in the chat or in named page targets the chat can update, with per-target component limits and failure handling.",
        status: "partial",
        statusNote: "Live: the page's errorBoundary provider with the 'limit the components' and 'autoScroll off' targets and its CSS. Broken: 'Add a page target' (FeaturedProducts needs a products list and a Product type the page never defines) and 'One target for each item' (reads an undefined product). shopUI is the Catalogs page's catalog. Not yet browser-checked.",
      },
      {
        path: "/generative-ui/components/catalogs",
        hasDemo: true,
        agentId: "components_agent",
        title: "Catalogs",
        docPath: "/deepagents/generative-ui/components/catalogs",
        summary: "One typed catalog declaring which components the agent may render and their props, combinable and exportable for other A2UI tools.",
        status: "partial",
        statusNote: "Live: shopUI ('Create a catalog'). Broken: 'Combine catalogs' extends an undefined cartUI (so the export sample, which exports it, too); the schema-library and positional-order samples are fragments, shown not run. Not yet browser-checked.",
      },
      {
        path: "/generative-ui/components/standard-catalog",
        hasDemo: true,
        agentId: "components_agent",
        title: "Standard catalog",
        docPath: "/deepagents/generative-ui/components/standard-catalog",
        summary: "The built-in set of standard components, and how to drop, add to or replace them.",
        status: "partial",
        statusNote: "Live: standardUI as is, omit and overrides. Broken: 'Add your own components' uses ProductCard and productSchema, never defined. Not yet browser-checked.",
      },
      {
        path: "/generative-ui/components/state-and-actions",
        title: "State and actions",
        docPath: "/deepagents/generative-ui/components/state-and-actions",
        summary: "Live app data inside generated UI, click handlers that run your code or message the agent, browser-side computed values, and kept user input.",
        status: "broken",
        statusNote: "Reference-only. Every sample needs pieces the page never defines (a Cart type and cart instance, ProductCard) or is a fragment (events, writable, function declarations), so nothing is mounted.",
      },
      {
        path: "/generative-ui/components/theming",
        hasDemo: true,
        agentId: "components_agent",
        title: "Theming",
        docPath: "/deepagents/generative-ui/components/theming",
        summary: "Colors, fonts and dark mode for the standard components through CSS variables.",
        status: "partial",
        statusNote: "Live: the provider theme, the page's CSS variables and its dark-mode script (rendered in the body, not <head>). Shown, not run: the per-mode and map theme fragments and the theme file. Not yet browser-checked.",
      },
      {
        path: "/generative-ui/components/transports",
        hasDemo: true,
        agentId: "components_agent",
        title: "Transports",
        docPath: "/deepagents/generative-ui/components/transports",
        summary: "How the agent delivers generated UI: a render_ui tool call, or a2ui blocks inside its markdown reply.",
        status: "partial",
        statusNote: "Live on a generativeUI: true runtime (/api/copilotkit-genui-transports), as printed: tool, markdown, and agentIds: [\"shop\"] chatting as default. No page publishes a shop agent, so only the 'other agents get nothing' half runs. Not yet browser-checked.",
      },
      {
        path: "/generative-ui/components/markdown-mode",
        hasDemo: true,
        agentId: "components_agent",
        title: "Markdown mode",
        docPath: "/deepagents/generative-ui/components/markdown-mode",
        summary: "The agent writes UI as a2ui code blocks inside its markdown reply, streamed and rendered with no tool call.",
        status: "partial",
        statusNote: "Live: both providers. sendContext: false is expected to show no UI: the page's own-prompt backend is Python only, and the Deep Agents graph does not read forwardedProps. Not yet browser-checked.",
      },
      {
        path: "/generative-ui/components/from-a2ui",
        hasDemo: true,
        agentId: "components_agent",
        title: "Adopt from A2UI",
        docPath: "/deepagents/generative-ui/components/from-a2ui",
        summary: "Migrating from the A2UI v0.9 renderer to components and surfaces (A2UI 1.0): provider, catalog, operations and agent input.",
        status: "partial",
        statusNote: "Live: the After catalog on the shared runtime. Airport and Arrow are never defined on the page; minimal ones are borrowed from aws-strands-ts (labelled). Not yet browser-checked.",
      },
      {
        path: "/generative-ui/a2ui",
        title: "A2UI",
        docPath: "/deepagents/generative-ui/a2ui",
        summary: "Declarative agent-described UI surfaces (A2UI), switched on in the runtime with the a2ui option.",
        status: "broken",
        statusNote: "Reference-only. The agent-side code is Python-only (copilotkit.a2ui helpers); the TypeScript runtime snippets register an undefined myAgent.",
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        title: "Dynamic Schema A2UI",
        docPath: "/deepagents/generative-ui/a2ui/dynamic-schema",
        summary: "An injected generate_a2ui tool where a secondary LLM writes both the A2UI schema and data from the prompt.",
        status: "broken",
        statusNote: "Reference-only. The agent is printed only as Python (agent/a2ui_dynamic.py); the frontend and runtime snippets use undefined myCatalog / myAgent.",
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        title: "Fixed Schema A2UI",
        docPath: "/deepagents/generative-ui/a2ui/fixed-schema",
        summary: "A pre-written A2UI schema filled with live data by a backend tool, with button actions carrying data-model context.",
        status: "broken",
        statusNote: "Reference-only. The search_flights tool and agent are Python-only (main.py elided); flight_schema.json is not printed.",
      },
      {
        path: "/generative-ui/json-render",
        title: "JSON Render",
        docPath: "/deepagents/generative-ui/json-render",
        summary: "The agent emits a { root, elements } JSON spec that a custom assistant-message slot renders through a typed @json-render registry.",
        status: "broken",
        statusNote: "Reference-only. The rendered Deep Agents page prints only an example of agent output; the demo/Code tab has no Deep Agents files, so neither the renderer, catalog/registry nor agent is published.",
      },
      {
        path: "/generative-ui/hashbrown",
        title: "Hashbrown",
        docPath: "/deepagents/generative-ui/hashbrown",
        summary: "A streamed sales dashboard: Hashbrown's UI kit and progressive JSON parser render the agent's ui array as it arrives.",
        status: "broken",
        statusNote: "Reference-only. The rendered Deep Agents page prints only an example agent envelope; no renderer, UI kit or agent is published for Deep Agents.",
      },
      {
        path: "/generative-ui/tool-based",
        title: "Components as Tools",
        docPath: "/deepagents/generative-ui/tool-based",
        summary: "A React component registered with useComponent and exposed to the agent as a frontend tool, rendered inline when called.",
        status: "broken",
        statusNote: "Reference-only. The useComponent registration is a missing deepagents::gen-ui-tool-based snippet, and the backend steps are printed in Python only (no TypeScript tab).",
      },
    ],
  },
  {
    title: "App Control",
    routes: [
      {
        path: "/frontend-tools",
        hasDemo: true,
        agentId: "frontend_tools_agent",
        title: "Frontend Tools",
        docPath: "/deepagents/frontend-tools",
        summary:
          "A tool registered with useFrontendTool that executes in the browser when the agent calls it.",
        status: "working",
      },
      {
        path: "/webmcp",
        title: "WebMCP",
        docPath: "/deepagents/webmcp",
        summary:
          "Publishing an existing frontend tool to document.modelContext so WebMCP-aware browser agents can discover and call it.",
        status: "not-started",
        statusNote:
          "Tracked for drift only — no demo yet. The page’s own verification steps need Chrome 149+ with the WebMCP origin trial or chrome://flags/#enable-webmcp-testing, and CopilotKit no-ops wherever document.modelContext is absent, so there is nothing a headless Chromium run can show.",
      },
      {
        path: "/human-in-the-loop/governed-actions",
        title: "Governed Actions",
        docPath: "/deepagents/human-in-the-loop/governed-actions",
        summary:
          "Gating a side-effecting agent action behind an approval card, via useInterrupt or useHumanInTheLoop.",
        status: "working",
        hasDemo: true,
        statusNote:
          "The tool-call variant, with the page's schema unchanged — `z.record(z.unknown())` is valid on this repo's zod 3. The `useInterrupt` variant needs a backend that pauses a run and attaches `interrupt.metadata.action`, which no agent here does.",
      },
    ],
  },
  {
    title: "Shared State",
    routes: [
      {
        path: "/shared-state/in-app-agent-read",
        hasDemo: true,
        agentId: "shared_state_agent",
        title: "Reading agent state",
        docPath: "/deepagents/shared-state/in-app-agent-read",
        summary: "Reading the agent's language field in your own UI through useAgent.",
        status: "partial",
        statusNote:
          "The agent switches language and says so in Spanish, but the panel and the raw agent.state beside it stay on english — the delta never reaches the useAgent subscription.",
      },
      {
        path: "/shared-state/in-app-agent-write",
        hasDemo: true,
        agentId: "shared_state_agent",
        title: "Writing agent state",
        docPath: "/deepagents/shared-state/in-app-agent-write",
        summary:
          "Writing that same field back with agent.setState, then re-running with agent.runAgent.",
        status: "partial",
        statusNote:
          "State round-trips both ways, but the model never sees it: exposeState cannot read a field declared on another middleware.",
      },
      {
        path: "/shared-state/predictive-state-updates",
        hasDemo: true,
        agentId: "predictive_state_agent",
        extraAgentIds: ["predictive_manual_graph", "predictive_tool_graph"],
        title: "Predictive State Updates",
        docPath: "/deepagents/shared-state/predictive-state-updates?agent-type=prebuilt",
        summary:
          "All three of the page's variants running side by side: the prebuilt middleware, and both custom graphs.",
        status: "partial",
        statusNote:
          "Both custom graphs work — the TypeScript tabs print them in full, unlike the Python ones. The prebuilt tab does not: the chat answers with a full multi-step plan while Agent Progress stays empty for the whole run.",
      },
      {
        path: "/shared-state/state-inputs-outputs",
        title: "Input/Output Schemas",
        docPath: "/deepagents/shared-state/state-inputs-outputs",
        summary:
          "Splitting agent state into what the frontend may send, what it gets back, and what stays internal.",
        status: "reference",
        statusNote:
          "Reference only. The page is Python-only, and the JS dev server ignores the output schema, so there is nothing to demonstrate live.",
      },
      {
        path: "/shared-state/workflow-execution",
        title: "Workflow Execution",
        docPath: "/deepagents/shared-state/workflow-execution",
        summary:
          "Listed separately in the nav, but the page currently serves the Input/Output Schemas content verbatim.",
        status: "reference",
        statusNote:
          "Reference only — the page is an upstream duplicate of Input/Output Schemas, so there is nothing of its own to implement.",
      },
    ],
  },
  {
    title: "Agent capabilities",
    routes: [
      {
        path: "/multi-agent/subagents",
        title: "Sub-agents",
        docPath: "/deepagents/multi-agent/subagents",
        summary: "A supervisor delegating to specialised sub-agents exposed as tools, with a live delegation log rendered from shared state.",
        status: "broken",
        statusNote: "Reference-only. The rendered Deep Agents page shows 'Missing snippet — No demo found for deepagents::subagents' in all three code cells (sub-agents, supervisor tools, delegation log), so there is no agent, tool or component to build.",
      },
    ],
  },
  {
    title: "Intelligence",
    routes: [
      {
        path: "/intelligence/quickstart",
        title: "Intelligence · Quickstart",
        docPath: "/deepagents/intelligence/quickstart",
        summary:
          "The single-route runtime transport this page switched to: one POST mount plus `useSingleEndpoint` on the provider.",
        status: "partial",
        statusNote:
          "Steps 3 and 4 are implemented against a third runtime mount at `/api/copilotkit-single`. Steps 1, 2 and 5 need a `CPK_INTELLIGENCE_API_KEY` from a hosted Intelligence project, which is an account-scoped resource this harness does not have.",
        hasDemo: true,
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/deepagents",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};
