import Link from "next/link";

import { RouteHeader, StatusBadge } from "@/components/route-header";
import { Callout, CodeBlock, KeyValue, Panel } from "@/components/ui";
import { ALL_ROUTES, DOCS_ROOT } from "@/lib/nav-config";
import { GRAPH_IDS, LANGGRAPH_DEPLOYMENT_URL } from "@/lib/agents";
import { DocSyncedAt } from "@/components/doc-synced-at";
import { DocDriftPanel } from "@/components/doc-drift-panel";

/** Dynamic: the doc-sync readouts below read the snapshot off disk. */
export const dynamic = "force-dynamic";

const ROUTES_WITH_AGENTS = ALL_ROUTES.filter((r) => r.agentId);

/**
 * The "connect" snippet the Introduction page prints since the 2026-11 doc
 * sync, copied as published. It is shown here for comparison only; the
 * harness's real mount is `app/api/copilotkit/[[...slug]]/route.ts`, which
 * builds the same runtime/handler shape with one LangGraphAgent per graph.
 */
const INTRO_CONNECT_SNIPPET = `import { CopilotRuntime, createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

const runtime = new CopilotRuntime({
  agents: {
    sample_agent: new LangGraphAgent({
      deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL!,
      graphId: "sample_agent",
      langsmithApiKey: process.env.LANGSMITH_API_KEY!,
    }),
  },
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/" />


      <DocDriftPanel />

      <Panel title="What this is">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working implementation of every Deep Agents doc page listed in the
          nav, one route each, built from the <strong>TypeScript</strong> tab of
          each page. Each route pairs notes with the repo&apos;s own source —
          read off disk at render time, so what you see is what runs 
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agents are LangGraph graphs built with{" "}
          <code>createDeepAgent</code> from the <code>deepagents</code> npm
          package, served by the LangGraph JS dev server, and reached through a
          Next route running <code>CopilotRuntime</code>. Three of the thirteen
          graphs are hand-built <code>StateGraph</code>s, because the pages they
          come from are about LangGraph features a prebuilt Deep Agent does not
          expose.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "Doc root",
                <a
                  key="d"
                  href={DOCS_ROOT}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  {DOCS_ROOT}
                </a>,
              ],
              ["Language tab", "TypeScript"],
              ["Docs synced", <DocSyncedAt key="docs-synced" withPages />],
              ["Agent server", <code key="u">{LANGGRAPH_DEPLOYMENT_URL}</code>],
              ["Graphs served", `${GRAPH_IDS.length}`],
            ]}
          />
        </div>
      </Panel>
      <Panel
        title="Graph roster"
        description="Every route that drives a real agent, and the langgraph.json graph id it addresses."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                <th className="pb-2 pr-4 font-medium">Route</th>
                <th className="pb-2 pr-4 font-medium">Graph id</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROUTES_WITH_AGENTS.map((route) => (
                <tr key={route.path}>
                  <td className="py-2.5 pr-4">
                    <Link
                      href={route.path}
                      className="text-[var(--accent)] underline underline-offset-4"
                    >
                      {route.title}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {[route.agentId, ...(route.extraAgentIds ?? [])].join(", ")}
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={route.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Two routes have no agent and are reference-only: Workflow Execution,
          whose doc page currently serves a different page&apos;s content, and
          Input/Output Schemas, whose graph is real but cannot demonstrate the
          feature because the JS dev server ignores <code>output</code> schemas.
          The <code>state_io_graph</code> is still served and its source is on
          that route.
        </p>
      </Panel>

      <Panel
        title="How the page says to connect"
        description="The Introduction now prints a single runtime route; the agent itself is untouched and reached over AG-UI."
      >
        <CodeBlock
          filename="app/api/copilotkit/[[...slug]]/route.ts (doc page)"
          language="ts"
          code={INTRO_CONNECT_SNIPPET}
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          This harness mounts the same shape at{" "}
          <code>frontend/src/app/api/copilotkit/[[...slug]]/route.ts</code>,
          with the runtime factored into{" "}
          <code>frontend/src/lib/intelligence-runtime.ts</code> so it can register
          one <code>LangGraphAgent</code> per graph and switch to Intelligence
          mode when a project key is set. Two small differences from the
          snippet: the harness defaults <code>LANGGRAPH_DEPLOYMENT_URL</code> to{" "}
          <code>http://localhost:8124</code> and <code>LANGSMITH_API_KEY</code>{" "}
          to <code>&quot;&quot;</code> rather than asserting them with{" "}
          <code>!</code>, and it exports the four verbs in one statement.
        </p>
      </Panel>

      <Panel title="Nothing here is invented">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          No tool, hook or config on any route was made up. Everything traces to
          the doc page that route links to. Where a page omits something needed
          to run — a <code>createDeepAgent</code> call, a graph manifest — the
          gap is named on the route itself and in the repo README rather than
          quietly filled in.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Where a page&apos;s code simply does not work, it is left as printed
          and the failure is documented rather than patched — see{" "}
          <Link
            href="/generative-ui/your-components/interrupt-based"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Interrupt-based HITL
          </Link>
          , whose second tab is the doc&apos;s snippet verbatim and does not
          compile without a <code>@ts-expect-error</code>.
        </p>
      </Panel>

      <Callout tone="info" title="Where to start">
        <p>
          <Link href="/quickstart" className="underline underline-offset-4">
            Quickstart
          </Link>{" "}
          proves the whole stack is connected in one message. If it streams a
          reply, every other route&apos;s plumbing is fine and anything you hit
          after that is about that page&apos;s feature.
        </p>
        <p className="mt-2">
          <Link href="/status" className="underline underline-offset-4">
            Status overview
          </Link>{" "}
          is the QA table:{" "}
          {ALL_ROUTES.filter((r) => r.status === "working").length} working,{" "}
          {ALL_ROUTES.filter((r) => r.status === "partial").length} partial,{" "}
          {ALL_ROUTES.filter((r) => r.status === "reference").length} reference,{" "}
          {ALL_ROUTES.filter((r) => r.status === "broken").length} broken.
        </p>
      </Callout>
    </>
  );
}
