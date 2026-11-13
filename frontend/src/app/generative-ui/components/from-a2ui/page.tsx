import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `const runtime = new CopilotRuntime({
  agents,
  a2ui: { injectA2UITool: false, agents: ["shop"] },
});`;

const BLOCK_1 = `// Nothing: a run that carries a catalog gets the render_ui tool and the guide.
// To force or limit it: generativeUI: true, or generativeUI: { agents: ["shop"] }.
const runtime = new CopilotRuntime({ agents });`;

const BLOCK_2 = `import { createCatalog, DynamicStringSchema } from "@copilotkit/a2ui-renderer";

const definitions = {
  Airport: {
    props: z.object({ code: DynamicStringSchema, city: DynamicStringSchema }),
  },
  Arrow: { props: z.object({}) },
};
const renderers = { Airport, Arrow };
export const myCatalog = createCatalog(definitions, renderers, {
  catalogId: "acme/flights",
  includeBasicCatalog: true,
});`;

const BLOCK_3 = `import {
  createGenerativeUI,
  standardUI,
} from "@copilotkit/react-core/v2/generative-ui";

export const appUI = createGenerativeUI({
  id: "acme/flights@1",
  extends: [standardUI],
  components: {
    Airport: {
      component: Airport,
      description: "An airport by IATA code, with its city under it.",
      props: z.object({ code: z.string(), city: z.string() }),
    },
    Arrow: { component: Arrow, description: "An arrow between two airports." },
  },
});`;

const BLOCK_4 = `provideCopilotKit({ runtimeUrl: "/api/copilotkit" }),
provideGenerativeUI({ ui: appUI }),`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/from-a2ui" />

      <Callout tone="info" title="How this route is wired">
        <p>
          The demo runs on <code>/api/copilotkit-genui</code>
          , the section&apos;s runtime mounted beside the main
          one. Its agent is <code>components_agent</code>, a Deep Agents graph
          standing in for the section&apos;s TanStack <code>BuiltInAgent</code>
          (same prompt, no tools; <code>copilotkitMiddleware</code> hands it
          the run&apos;s <code>render_ui</code> tool and context). Each
          provider&apos;s <code>generativeUI</code> value is the page&apos;s;
          only its <code>runtimeUrl</code> differs. Needs CopilotKit 1.87
          (this repo was on 1.72.0, which has no{" "}
          <code>v2/generative-ui</code>). What runs and what stays broken is in
          the status note above.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Migrating from the A2UI v0.9 renderer to components and surfaces (A2UI 1.0): provider, catalog, operations and agent input.
        </p>
      </Panel>

      <Panel
        title="The page's React code, verbatim (not mounted)"
        description="Angular tabs omitted; this is a React harness."
      >
        <div className="space-y-4">
          <CodeBlock filename="Runtime, before" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="Runtime, after" language="tsx" code={BLOCK_1} />
          <CodeBlock filename="Before" language="tsx" code={BLOCK_2} />
          <CodeBlock filename="After" language="tsx" code={BLOCK_3} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_4} />
        </div>
      </Panel>
    </>
  );
}
