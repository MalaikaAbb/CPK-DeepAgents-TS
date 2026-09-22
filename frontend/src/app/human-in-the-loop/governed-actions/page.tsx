import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

/**
 * The tool-call half of the Governed Action Approval UI page.
 *
 * The page is byte-identical under all five framework prefixes, so this is the
 * same implementation Agno-react and Mastra-react carry. It is built here
 * rather than cross-referenced so the recorder has a take in every repo and so
 * the zod-version difference between the repos is visible.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A checkpoint in front of a side-effecting action. The agent proposes
          one — send an email, update a record, apply a discount — and the run
          stops on an approval card showing what it wants to do, which policy
          reference produced the verdict, and the exact arguments. It runs only
          if you approve.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The envelope is a plain <code>GovernedAction</code> object with a{" "}
          <code>verdict</code> of <code>allow</code>, <code>deny</code> or{" "}
          <code>require_approval</code>. Only the last one draws buttons; the
          other two resolve themselves from an effect.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Send an invoice reminder to acme@example.com — ask me to approve it first",
              "Now try one that policy should block",
            ]}
            expect="An approval card appears in the chat and the run stops on it. Approving returns an approved response and the agent continues; rejecting returns a refusal and the agent picks another path."
            fail="The agent describes the action in prose and never calls the tool — the model chose not to route through the checkpoint, which is the weakness noted below."
          />
        </div>
      </Panel>

      <Callout tone="info" title="The published schema compiles as written">
        <code>z.record(z.unknown())</code> is a zod 3 signature and this repo is
        on zod 3.25.76, so the schema goes in unchanged. It does{" "}
          <em>not</em> compile on zod 4, which is what MsPy-react and AG2-react
        run — the page names no zod version anywhere.
      </Callout>

      <Callout tone="warn" title="The `useInterrupt` half is mounted, and never fires">
        The page leads with a <code>useInterrupt</code> variant that reads{" "}
        <code>interrupt?.metadata?.action</code>. It is on the demo page
        verbatim, beside the tool-call variant — but it needs a backend that
        pauses a run and attaches an action to it, and the page publishes only
        the consuming half. It does not say which backends can do this or how
        the action gets into <code>metadata</code>. No agent in this repo
        pauses for it, so the card never appears from this path. Three more
        gaps sit behind that one:
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>It does not type-check.</strong> The render callback returns{" "}
            <code>null</code> when there is no action, but{" "}
            <code>useInterrupt</code>&apos;s <code>render</code> is typed to
            return a <code>ReactElement</code>: <code>tsc</code> reports TS2322.
            Left as published.
          </li>
          <li>
            <strong>It names no agent.</strong> With no <code>agentId</code>{" "}
            and no agent on the provider, the hook resolves to{" "}
            <code>&quot;default&quot;</code> — not an agent here — and quietly
            listens to a provisional one. The page does not say where to mount
            the component or which agent it follows.
          </li>
          <li>
            <strong>
              <code>metadata.action</code> would not arrive on this stack anyway.
            </strong>{" "}
            The installed LangGraph adapter (<code>@ag-ui/langgraph</code>{" "}
            0.0.43) builds every interrupt&apos;s <code>metadata</code> as{" "}
            <code>{"{ langgraph: { raw, ns, resumable, when } }"}</code>, so a
            graph calling <code>interrupt({"{ action }"})</code> lands at{" "}
            <code>metadata.langgraph.raw.action</code>. The snippet&apos;s
            guard would return <code>null</code> and draw nothing. Read from the
            adapter source; not exercised live, since there is no backend to
            exercise it with.
          </li>
        </ul>
      </Callout>

      <Callout tone="warn" title="Nothing enforces the guardrails the page lists">
        The page closes with five guardrails — check policy server-side, use a
        stable <code>id</code> and <code>reference</code> so an approval cannot
        be replayed, show the exact arguments, treat <code>deny</code> as
        terminal, log everything. Every one of them is prose. The code above
        implements none: <code>handleApproval</code> compares{" "}
        <code>actionId</code> and <code>reference</code>, but it is a standalone
        function the page never wires to anything, and the tool variant does not
        call it at all. Follow the snippets and you get an approval UI with no
        replay protection and no audit trail, while the page reads as though it
        covered both.
      </Callout>

      <Callout tone="warn" title="The verdict shortcut fires from an effect with a stale dep list">
        <code>GovernedActionCard</code> auto-approves on <code>allow</code> and
        auto-blocks on <code>deny</code> from a <code>useEffect</code> keyed on{" "}
        <code>[action.id, action.verdict]</code> — but the effect calls{" "}
        <code>onApprove</code> and <code>onBlock</code>, neither of which is in
        the dependency array. Linted verbatim,{" "}
        <code>react-hooks/exhaustive-deps</code> reports both as missing, and
        that warning is left standing here rather than silenced — the same call
        Agno-react and Mastra-react made. It happens to work because the handlers
        only close over <code>args</code>, which changes with the id, but it will
        not survive a reader wrapping those handlers in state.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/human-in-the-loop/governed-actions/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
