import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Callout tone="warn" title="The page says this is not available for Deep Agents — this repo shows otherwise">
        <p>
          The rendered Deep Agents page opens with &ldquo;<strong>Not available
          on this framework.</strong>&rdquo;, saying headless interrupts (built on <code>useInterrupt</code> / <code>useFrontendTool</code>) needs a runtime with a
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
          Resolving interrupts from any UI rather than a 
          <code>useInterrupt</code> render slot: subscribe to the agent, read
          pending interrupts when a run finishes, and resume it with 
          <code>copilotkit.runAgent</code> carrying the user&apos;s answer. The
          rendered page prints no code for Deep Agents.
        </p>
      </Panel>
    </>
  );
}
