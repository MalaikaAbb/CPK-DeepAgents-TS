import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

/**
 * The page's two halves are tracked separately here.
 *
 * Its `useInterrupt` half is implemented — on the Interrupt-based route, which
 * is where the interrupt plumbing already lives. Building a second chat here to
 * raise the same interrupt would duplicate the agent, the graph id and the
 * runtime wiring to show the same card, so this route links to it instead.
 *
 * Its `useHumanInTheLoop` half is not implemented. Nothing on this page is
 * framework-specific — it is published byte-identical under /ag2, /agno,
 * /mastra, /ms-agent-python and /deepagents — and that half is covered in
 * Agno-react and Mastra-react.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A side-effecting agent action gated behind an approval checkpoint: the
          agent proposes it, a policy decides a verdict before anything is shown,
          the browser renders a card naming the action and the rule that judged
          it, and the action runs only on an approval that matches that exact
          proposal.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page gives two ways to reach that. The <code>useInterrupt</code>{" "}
          one is live in this repo, on the{" "}
          <Link
            className="underline"
            href="/generative-ui/your-components/interrupt-based/demo-chat"
          >
            Interrupt-based demo
          </Link>{" "}
          — second tab, &ldquo;Two, dispatched by type&rdquo;. A{" "}
          <code>wrapToolCall</code> hook intercepts <code>send_email</code>,
          evaluates the outbound-email policy on the server, and interrupts with
          the page&apos;s envelope; the card resolves with{" "}
          <code>{"{ approved, actionId, reference }"}</code> and the agent
          re-checks both ids before the tool runs.
        </p>
      </Panel>

      <Panel
        title="The pieces"
        description="The envelope and the policy, then the hook that raises the approval."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/src/interruptBased.ts", region: "governed-action" },
            { file: "backend/src/interruptBased.ts", region: "multi-interrupt" },
            {
              file: "frontend/src/app/generative-ui/your-components/interrupt-based/demo-chat/page.tsx",
              region: "conditional-interrupts",
            },
          ]}
        />
      </Panel>

      <Callout tone="success" title="The guardrails, and where each one lands">
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <strong>Verdict decided on the server.</strong>{" "}
            <code>evaluateEmailPolicy</code> runs in the middleware before{" "}
            <code>interrupt()</code>. The card only reports the verdict; it never
            computes one.
          </li>
          <li>
            <strong>Stable id and reference.</strong> The action id is the tool
            call id, which survives the replay that resuming an interrupt
            performs, so the same approval cannot be matched to a different
            proposal. Both are re-checked in <code>readDecision</code> before the
            tool runs.
          </li>
          <li>
            <strong>Exact arguments shown.</strong> The card prints{" "}
            <code>action.arguments</code> as sent, not the model&apos;s prose
            about them.
          </li>
          <li>
            <strong><code>deny</code> is terminal.</strong> The card calls{" "}
            <code>cancel()</code> rather than resolving, and the tool result
            tells the model not to propose the same action again.
          </li>
          <li>
            <strong>Auditable.</strong> Proposal, verdict, decision and outcome
            are logged server-side, and the tool result — send or refusal — is
            rendered in the transcript by <code>useDefaultRenderTool</code>{" "}
            rather than left to the model to paraphrase.
          </li>
        </ul>
      </Callout>

      <Callout tone="warn" title="One correction to the page's card">
        <p>
          <code>GovernedActionCard</code> auto-decides <code>allow</code> and{" "}
          <code>deny</code> from a <code>useEffect</code> keyed on{" "}
          <code>[action.id, action.verdict]</code>. React 19 StrictMode runs
          every effect twice on mount in development, so as printed an{" "}
          <code>allow</code> resumes the run twice from one card. The demo adds a
          ref so the decision fires once per action id.
        </p>
      </Callout>

      <Callout tone="info" title="Not implemented from this page">
        <p>
          The <code>useHumanInTheLoop</code> half — the same approval registered
          as an LLM-callable tool rather than a graph interrupt. The page&apos;s
          snippets there are plain React with nothing framework-specific in them,
          and the identical page is served under all five framework prefixes, so
          that half is covered in Agno-react and Mastra-react and is tracked here
          for drift only.
        </p>
      </Callout>
    </>
  );
}
