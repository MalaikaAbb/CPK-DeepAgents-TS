import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The frontend code blocks the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `outcome.type === "interrupt"
outcome.interrupts  // Interrupt[]`;

const BLOCK_1 = `function ApprovalInterrupt() {
  useInterrupt({
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });
  return null;
}`;

const BLOCK_2 = `useInterrupt({
  render: ({ interrupts, resolve, cancel }) => (
    <ul>
      {interrupts.map((i) => (
        <li key={i.id}>
          {i.message}
          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>
          <button onClick={() => cancel(i.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  ),
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Callout tone="warn" title="The page says this is not available for Deep Agents — this repo shows otherwise">
        <p>
          The rendered Deep Agents page opens with &ldquo;<strong>Not available
          on this framework.</strong>&rdquo;, saying <code>useInterrupt</code> needs a runtime with a
          native <code>interrupt(...)</code> primitive such as LangGraph. Deep
          Agents compile to LangGraph graphs, and this repo&apos;s{" "}
          <Link href="/generative-ui/your-components/interrupt-based" className="underline underline-offset-4">
            Interrupt-based HITL
          </Link>{" "}
          route runs <code>useInterrupt</code> against a Deep Agents middleware
          calling LangGraph <code>interrupt()</code> — working. The banner
          contradicts that. Since the page publishes no Deep Agents backend
          (its setup is &ldquo;not bundled for deepagents&rdquo;), nothing is
          mounted: reference-only, <strong>Broken</strong>.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A graph-enforced pause: a backend tool calls <code>interrupt(...)</code>,
          the run ends with <code>outcome.type === &quot;interrupt&quot;</code> 
          and a list of interrupts, and <code>useInterrupt</code> renders a
          component whose <code>resolve(payload, id?)</code> / 
          <code>cancel(id?)</code> resume or abandon the run. Interrupts may
          carry a <code>responseSchema</code>; the older 
          <code>on_interrupt</code> custom-event path is still understood.
        </p>
      </Panel>

      <Panel title="The page's frontend code (not mounted)">
        <div className="space-y-4">
          <CodeBlock filename="interrupt outcome" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="single interrupt (ApprovalInterrupt)" language="tsx" code={BLOCK_1} />
          <CodeBlock filename="several interrupts" language="tsx" code={BLOCK_2} />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The page&apos;s backend example (a <code>schedule_meeting</code> tool
          calling <code>interrupt()</code>) exists only in the <code>.md</code> 
          export as LangGraph Python <code>create_agent</code> code; the
          rendered Deep Agents page does not show it.
        </p>
      </Panel>
    </>
  );
}
