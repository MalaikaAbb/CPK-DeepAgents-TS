import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

/**
 * Steps 3 and 4 of the doc are implemented here. Steps 1, 2 and 5 are not, and
 * cannot be: they start at `npx copilotkit@latest login` and a
 * `CPK_INTELLIGENCE_API_KEY` from a hosted Intelligence project, which is an
 * account-scoped resource this harness does not have.
 *
 * The route used to be a bare header for that reason. It stopped being one when
 * the 2026-09-09 sync rewrote steps 3 and 4 from the multi-route handler to the
 * single-route one — that half needs no hosted project, so it is now the half
 * under test.
 */
// The page's TypeScript "existing runtime that already has a runner" diff and
// its self-hosted endpoint settings, copied as printed (the `[!code --]` /
// `[!code ++]` markers rendered as diff comments). Shown for reference: the
// harness's `buildRuntime()` already passes `runner` only in SSE mode, and
// leaves `apiUrl` / `wsUrl` unset for the cloud-hosted default.
const RUNNER_DIFF = `const runtime = new CopilotRuntime({
  agents,
  runner: new InMemoryAgentRunner(), // [!code --]
  intelligence, // [!code ++]
  identifyUser,
});`;

const SELF_HOSTED = `const intelligence = new CopilotKitIntelligence({
  apiUrl: "https://api.intelligence.internal",
  wsUrl: "wss://realtime.intelligence.internal",
  apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/intelligence/quickstart" />

      <Callout tone="info" title="2026-11 doc sync: the page is back on multi-route">
        <p>
          For a TypeScript runtime the page now mounts the multi-route handler
          again: <code>app/api/copilotkit/[[...slug]]/route.ts</code>, exporting{" "}
          <code>GET</code>, <code>POST</code>, <code>PATCH</code> and{" "}
          <code>DELETE</code>, with <code>useSingleEndpoint={"{false}"}</code> on
          the provider. Single-route is now only &ldquo;keep it if your existing
          app already uses it&rdquo;. The demo&apos;s first tab is the new
          guidance (this repo&apos;s main <code>/api/copilotkit</code> mount,
          which already had that exact shape, plus a nested{" "}
          <code>CopilotKitProvider</code> from the page and the new{" "}
          <code>/info</code> discovery check). The second tab is the
          single-route setup documented below, kept because the page still
          names it as supported.
        </p>
        <p className="mt-2">
          Also new: a &ldquo;remove <code>runner</code> when you add{" "}
          <code>intelligence</code>&rdquo; note (TypeScript rejects both; this
          repo&apos;s <code>buildRuntime()</code> already passes the runner only
          in SSE mode), self-hosted <code>apiUrl</code>/<code>wsUrl</code>{" "}
          settings, a troubleshooting list, and Python / Go / Ruby / C# native
          runtime tabs. Only the TypeScript tab applies to this repo. The
          runtime snippet&apos;s <code>identifyUser</code> calls an{" "}
          <code>authenticateApplicationUser</code> the page says stands for your
          own auth; this harness keeps its fixed header identity.
        </p>
        <p className="mt-2">
          The &ldquo;page contradicts itself&rdquo; finding below is resolved:
          the coding-agent prompt and the manual steps both describe
          multi-route now.
        </p>
      </Callout>

      <Panel title="Runner vs. Intelligence, and self-hosted endpoints (page snippets)">
        <div className="space-y-4">
          <CodeBlock filename="Existing runtime with a runner (page)" language="ts" code={RUNNER_DIFF} />
          <CodeBlock filename="Self-hosted endpoints (page, TypeScript tab)" language="ts" code={SELF_HOSTED} />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Compare with <code>frontend/src/lib/intelligence-runtime.ts</code>:
          the SSE branch builds <code>runner: new InMemoryAgentRunner()</code>{" "}
          and no <code>intelligence</code>; the Intelligence branch builds{" "}
          <code>intelligence</code> + <code>identifyUser</code> and no runner.
          No self-hosted deployment is available to this harness, so{" "}
          <code>apiUrl</code> / <code>wsUrl</code> stay unset.
        </p>
      </Panel>

      <Panel title="Multi-route provider (page's current step)">
        <SourceCode file="frontend/src/components/multi-route-provider.tsx" />
      </Panel>

      <Panel title="What the single-route tab demonstrates (2026-09-09 → 2026-11 guidance)">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The single-route runtime transport. Until the 2026-09-09 sync this
          page mounted the multi-route handler at{" "}
          <code>app/api/copilotkit/[[...slug]]/route.ts</code> and exported four
          verbs. It now mounts <code>mode: &quot;single-route&quot;</code> at a
          plain <code>route.ts</code>, exports only <code>POST</code>, and pairs
          it with <code>useSingleEndpoint</code> on the provider.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That is a second runtime mount in this repo, not a rewrite of
          an existing one. <code>/api/copilotkit</code> stays multi-route
          because{" "}
          <a
            href="/quickstart"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Quickstart
          </a>{" "}
          still publishes <code>[[...slug]]</code>, <code>GET</code> +{" "}
          <code>POST</code>, and <code>useSingleEndpoint=&#123;false&#125;</code>.
          It is also the only mount that can serve this repo&apos;s thread
          routes, which multi-route mode alone dispatches. The new mount takes
          the same runtime object, so the only variable between them is the
          transport.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Multi-route tab: press GET /api/copilotkit/info, then 'Tell me a one-line joke.'", "Single-route tab: Tell me a one-line joke."]}
            expect="Multi-route: /info answers 200 listing sample_agent, with mode \"intelligence\" when CPK_INTELLIGENCE_API_KEY is set (SSE otherwise), and the reply streams through /api/copilotkit/agent/sample_agent/run. Single-route: the reply streams normally. Every request in the network tab is a POST to /api/copilotkit-single carrying a { method, params, body } envelope — no /info, /agent/sample_agent/run, or /threads paths at all."
            fail="The chat never connects, or requests fall back to REST paths under /api/copilotkit-single, which would mean the provider negotiated its way off the single-route transport."
          />
        </div>
      </Panel>

      <Panel title="The route">
        <SourceCode file="frontend/src/app/api/copilotkit-single/route.ts" />
      </Panel>

      <Panel title="The provider">
        <SourceCode file="frontend/src/components/single-endpoint-provider.tsx" />
      </Panel>

      <Callout
        tone="warn"
        title="Single-route does not carry thread, memory, or annotation requests"
      >
        The step is introduced with &quot;It carries chat, thread, memory, and
        annotation requests through one <code>POST</code> endpoint.&quot; Only
        the first of those four is true at <code>@copilotkit/runtime</code>{" "}
        1.69.2. <code>validateMethod</code> in{" "}
        <code>v2/runtime/endpoints/single-route-helpers</code> accepts exactly
        seven envelope methods — <code>agent/run</code>,{" "}
        <code>agent/suggest</code>, <code>agent/connect</code>,{" "}
        <code>agent/stop</code>, <code>info</code>,{" "}
        <code>inspector/metadata</code>, <code>transcribe</code> — and answers{" "}
        <code>400 Unsupported method</code> for anything else. The multi-route
        router matches twenty, including all eight <code>threads/*</code>, all
        four <code>memories/*</code>, and <code>annotate</code>. None of those
        thirteen is reachable through the single endpoint. Use the probe button
        on the demo to see it per request class.
      </Callout>

      <Callout
        tone="warn"
        title="Single-route mode also switches thread endpoints off in /info"
      >
        Separately from the method allowlist,{" "}
        <code>createCopilotRuntimeHandler</code> dispatches single-route
        requests with <code>threadEndpointsEnabled: false</code>, where
        multi-route passes <code>true</code>. That flag feeds{" "}
        <code>resolveThreadEndpointInfo</code>, so a single-route{" "}
        <code>/info</code> reports no REST thread endpoints and no managed
        thread metadata even when the runtime is a full Intelligence runtime.
        The client believes it, and stops asking. So the doc&apos;s closing step
        — open Inspector, find your thread under <strong>Threads</strong> —
        cannot pass on the transport the same page just told you to adopt.
      </Callout>

      <Callout tone="info" title="Resolved 2026-11: the page contradicted itself">
        The coding-agent prompt at the top of the page is unchanged, and still
        instructs the agent to &quot;enable the multi-route Runtime, align the
        frontend transport, and expose the full Runtime subtree for GET, POST,
        PATCH, and DELETE.&quot; The manual steps immediately below now say
        single-route, one verb. Whichever half a reader follows, the other half
        of the same page describes a different app.
      </Callout>

      <Callout tone="premium" title="Steps 1, 2 and 5 stay out of reach">
        <code>npx copilotkit@latest login</code> and{" "}
        <code>project select</code> mint a{" "}
        <code>CPK_INTELLIGENCE_API_KEY</code> against a hosted Intelligence
        project tied to an account. Without one the runtime behind this route
        falls back to <code>InMemoryAgentRunner</code>, and the confirmation
        step — Inspector showing <strong>Intelligence connected</strong> and a
        saved thread — has nothing to assert against. Set{" "}
        <code>CPK_INTELLIGENCE_API_KEY</code> and{" "}
        <code>COPILOTKIT_LICENSE_TOKEN</code> in{" "}
        <code>frontend/.env.local</code> and the mount picks them up with no
        code change.
      </Callout>

      <Callout
        tone="info"
        title="Suggestions quietly change shape on this transport"
      >
        Not a defect, but worth knowing before comparing this route against the
        others: the client only uses the stateless{" "}
        <code>/agent/:id/suggest</code> endpoint on non-<code>single</code>{" "}
        transports, because that URL is multi-route. Under{" "}
        <code>useSingleEndpoint</code> it falls back to cloning the provider
        agent and running it client-side instead.
      </Callout>
    </>
  );
}
