"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { MultiRouteProvider } from "@/components/multi-route-provider";
import { SingleEndpointProvider } from "@/components/single-endpoint-provider";

/**
 * Two tabs since the 2026-11 doc sync.
 *
 *   multi  — what the page now prints for a TypeScript runtime: the
 *            `[[...slug]]` handler with four verbs (this repo's main
 *            `/api/copilotkit` mount) and `useSingleEndpoint={false}` on the
 *            provider, plus the page's new "Confirm the connection" step — a
 *            GET of `{runtimeUrl}/info` that should report
 *            `mode: "intelligence"` and the registered agent.
 *   single — the single-route transport the page prescribed from 2026-09-09
 *            until this sync. The page now keeps it only as "if your existing
 *            app uses that mode, keep it", so it stays here as the second tab.
 *
 * The single-route tab's notes follow.
 *
 * The single-route transport, and a probe for the claim attached to it.
 *
 * The chat below runs entirely through `POST /api/copilotkit-single`. Nothing
 * about the conversation looks different — that part of the step works.
 *
 * The probe is here because the doc's sentence introducing the step is broader
 * than the endpoint: "It carries chat, thread, memory, and annotation requests
 * through one `POST` endpoint." Three of those four are checkable from the
 * browser in one click each, so the button sends the envelope and prints
 * whatever comes back.
 */

const PROBES = [
  {
    method: "info",
    claim: "negotiation",
    note: "Sent by the client itself on connect.",
  },
  {
    method: "agent/run",
    claim: "chat",
    note: "What the chat below uses.",
  },
  { method: "threads/list", claim: "thread", note: "Doc: thread requests." },
  { method: "memories/list", claim: "memory", note: "Doc: memory requests." },
  { method: "annotate", claim: "annotation", note: "Doc: annotation requests." },
] as const;

type Result = { status: number; body: string };

function ProbePanel() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [busy, setBusy] = useState(false);

  async function runProbes() {
    setBusy(true);
    const next: Record<string, Result> = {};
    for (const probe of PROBES) {
      try {
        const response = await fetch("/api/copilotkit-single", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ method: probe.method, params: {}, body: {} }),
        });
        next[probe.method] = {
          status: response.status,
          body: (await response.text()).slice(0, 240),
        };
      } catch (error) {
        next[probe.method] = { status: 0, body: String(error) };
      }
    }
    setResults(next);
    setBusy(false);
  }

  return (
    <div className="shrink-0 border-b border-slate-200 p-3 dark:border-slate-800">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runProbes}
          disabled={busy}
          className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-sm text-[var(--accent)] disabled:opacity-50"
        >
          {busy ? "Probing…" : "Probe the envelope methods"}
        </button>
        <p className="text-xs text-slate-500">
          POSTs <code>{'{ method, params, body }'}</code> to{" "}
          <code>/api/copilotkit-single</code>, once per documented request class.
        </p>
      </div>

      {Object.keys(results).length > 0 && (
        <table className="mt-3 w-full text-left text-xs">
          <thead className="text-slate-500">
            <tr>
              <th className="py-1 pr-3 font-medium">Doc claim</th>
              <th className="py-1 pr-3 font-medium">method</th>
              <th className="py-1 pr-3 font-medium">Status</th>
              <th className="py-1 font-medium">Response</th>
            </tr>
          </thead>
          <tbody className="align-top font-mono text-slate-700 dark:text-slate-300">
            {PROBES.map((probe) => {
              const result = results[probe.method];
              if (!result) return null;
              const ok = result.status !== 400 && result.status !== 404;
              return (
                <tr
                  key={probe.method}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="py-1 pr-3 font-sans">{probe.claim}</td>
                  <td className="py-1 pr-3">{probe.method}</td>
                  <td
                    className={`py-1 pr-3 ${
                      ok
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {result.status}
                  </td>
                  <td className="py-1 break-all">{result.body}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

//#region confirm-connection
/**
 * The page's "Confirm the connection" step, done from the browser instead of
 * `curl --fail http://localhost:3000/api/copilotkit/info`. Pass = HTTP 200,
 * `mode: "intelligence"`, and `sample_agent` among the agents. Without
 * `CPK_INTELLIGENCE_API_KEY` this runtime reports SSE mode, which is the
 * page's own "chat works, and the project has no thread" case.
 */
function InfoCheck() {
  const [result, setResult] = useState<
    { status: number; mode?: string; agents?: string[]; raw: string } | null
  >(null);

  async function check() {
    try {
      const response = await fetch("/api/copilotkit/info", {
        headers: { "x-user-id": "harness-local", "x-user-name": "Harness User" },
      });
      const raw = await response.text();
      let mode: string | undefined;
      let agents: string[] | undefined;
      try {
        const json = JSON.parse(raw) as {
          mode?: string;
          agents?: Record<string, unknown> | { id?: string; name?: string }[];
        };
        mode = json.mode;
        agents = Array.isArray(json.agents)
          ? json.agents.map((a) => a?.id ?? a?.name ?? "?")
          : json.agents
            ? Object.keys(json.agents)
            : undefined;
      } catch {
        // not JSON; show raw
      }
      setResult({ status: response.status, mode, agents, raw: raw.slice(0, 400) });
    } catch (error) {
      setResult({ status: 0, raw: String(error) });
    }
  }

  return (
    <div className="shrink-0 border-b border-slate-200 p-3 text-xs dark:border-slate-800">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={check}
          className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-sm text-[var(--accent)]"
        >
          GET /api/copilotkit/info
        </button>
        <span className="text-slate-500">
          The page&apos;s discovery check. Expect <code>mode: &quot;intelligence&quot;</code>{" "}
          and your agent.
        </span>
      </div>
      {result && (
        <div className="mt-2 font-mono text-slate-700 dark:text-slate-300">
          <div>
            status{" "}
            <span
              className={
                result.status === 200
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              }
            >
              {result.status}
            </span>{" "}
            · mode{" "}
            <span
              className={
                result.mode === "intelligence"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              }
            >
              {result.mode ?? "?"}
            </span>{" "}
            · agents {result.agents?.join(", ") ?? "?"}
          </div>
          {result.mode === undefined && (
            <div className="mt-1 break-all">{result.raw}</div>
          )}
        </div>
      )}
    </div>
  );
}
//#endregion

const TABS = [
  { id: "multi", label: "Multi-route (page now)" },
  { id: "single", label: "Single-route (kept, older page)" },
] as const;

export default function Page() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("multi");

  return (
    <DemoFrame
      parentPath="/intelligence/quickstart"
      subtitle={
        tab === "multi"
          ? "multi-route transport · /api/copilotkit"
          : "single-route transport · /api/copilotkit-single"
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 gap-2 border-b border-slate-200 px-3 py-2 text-xs dark:border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded px-2 py-1 ${
                tab === t.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "multi" ? (
          <MultiRouteProvider>
            <div className="flex min-h-0 flex-1 flex-col">
              <InfoCheck />
              <div className="min-h-0 flex-1">
                <CopilotChat agentId="sample_agent" />
              </div>
            </div>
          </MultiRouteProvider>
        ) : (
          <SingleEndpointProvider>
            <div className="flex min-h-0 flex-1 flex-col">
              <ProbePanel />
              <div className="min-h-0 flex-1">
                {/* [3] intelligence quickstart: chat over the single endpoint */}
                {/* [!code highlight] */}
                <CopilotChat agentId="sample_agent" />
              </div>
            </div>
          </SingleEndpointProvider>
        )}
      </div>
    </DemoFrame>
  );
}
