import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/standard-catalog" />

      <Callout tone="warn" title="Not started: needs a CopilotKit upgrade">
        <p>
          Components and surfaces live in 
          <code>@copilotkit/react-core/v2/generative-ui</code> (
          <code>standardUI</code>, <code>createGenerativeUI</code>, 
          <code>GenerativeUISurface</code>, …) and the provider&apos;s 
          <code>generativeUI</code> prop. That subpath is absent up to 1.79 and present by 1.83;
          this repo locks <code>@copilotkit/react-core</code> 
          1.72.0, where it does not exist. Upgrading CopilotKit (and the
          matching <code>@ag-ui/*</code> pins and lockfile) is outside this doc
          sync, so the page&apos;s code is shown here, not run.
        </p>
        <p className="mt-2">
          When it is built: the section&apos;s runtime snippet uses a TanStack 
          <code>BuiltInAgent</code>; per this repo&apos;s rules that becomes a
          Deep Agents graph on the LangGraph server, with the snippet&apos;s
          prompt and no extra tools.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The built-in set of standard components, and how to drop, add to or replace them.
        </p>
      </Panel>

      <Panel title="The page's code">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The rendered page prints no code blocks; it is a component reference.
        </p>
      </Panel>
    </>
  );
}
