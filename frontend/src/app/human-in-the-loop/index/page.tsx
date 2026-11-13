import Link from "next/link";

import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/index" />

      <MissingSnippets ids={["deepagents::hitl-in-chat (useHumanInTheLoop page)", "deepagents::hitl-in-chat (agent)"]}>
        <p>
          The page&apos;s two worked examples are missing for Deep Agents, and
          its setup step is marked &ldquo;not bundled for deepagents&rdquo;.
          Reference-only, <strong>Broken</strong>.
        </p>
      </MissingSnippets>

      <Panel title="What the page describes">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two ways to pause an agent and ask the user:{" "}
          <code>useHumanInTheLoop</code>, where the <em>model</em> decides to
          call a client-side tool whose <code>render</code> shows a component
          and <code>respond</code>s with the answer; and{" "}
          <code>useInterrupt</code>, where the <em>graph</em> calls{" "}
          <code>interrupt(...)</code> and the browser resolves it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Working examples of both already exist in this repo from other
          pages:{" "}
          <Link href="/human-in-the-loop/governed-actions" className="text-[var(--accent)] underline underline-offset-4">
            Governed Actions
          </Link>{" "}
          (<code>useHumanInTheLoop</code>) and{" "}
          <Link href="/generative-ui/your-components/interrupt-based" className="text-[var(--accent)] underline underline-offset-4">
            Interrupt-based HITL
          </Link>{" "}
          (<code>useInterrupt</code> against a Deep Agents middleware calling
          LangGraph <code>interrupt()</code>).
        </p>
      </Panel>
    </>
  );
}
