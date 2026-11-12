import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The page's two snippets that are not mounted, as printed.
const USE_AS_IS = "import { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\n<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>";
const EXTEND = "import { createGenerativeUI, standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI],\n  components: {\n    ProductCard: { component: ProductCard, props: productSchema },\n  },\n});";

const DIR = "frontend/src/app/generative-ui/components/standard-catalog/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/standard-catalog" />

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
          The built-in set of standard components, and how to drop, add to or replace them.
        </p>
      </Panel>

      <Panel title="The page's code">
        <div className="space-y-4">
          <CodeBlock code={USE_AS_IS} filename="Use it as it is (mounted: the 'standardUI as is' variant)" language="tsx" />
          <SourceCodeGroup
            files={[{ file: `${DIR}/omit.ts` }, { file: `${DIR}/override.tsx` }]}
            note="Drop components and Replace a component, mounted as variants. omit.ts gets the import line the snippet leaves out (labelled)."
          />
          <CodeBlock code={EXTEND} filename="Add your own components — broken: ProductCard and productSchema are never defined" language="ts" />
        </div>
      </Panel>
    </>
  );
}
