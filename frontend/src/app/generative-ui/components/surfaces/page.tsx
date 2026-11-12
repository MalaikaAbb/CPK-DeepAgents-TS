import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";
import { shopUI } from "./catalog";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <GenerativeUISurface
      id="featured"
      ui={shopUI}
      description="The Featured Products row of the home page. When the customer asks to see products here, show them as a ProductGrid with one ProductCard for each product. When they ask for the featured products again, delete this surface."
      components={["ProductGrid", "ProductCard"]}
      fallback={<ProductRow products={products} />}
    />
  );
}`;

const BLOCK_1 = `[data-generative-ui-surface] {
  scroll-margin-top: 6rem;
}`;

const BLOCK_2 = `<GenerativeUISurface
  key={product.id}
  id={\`recommendations-\${product.id}\`}
  description={\`The "You might also like" row under \${product.name}. Show related products here. Never include \${product.name} itself.\`}
/>`;

const BLOCK_3 = `<CopilotKitProvider
  runtimeUrl="/api/copilotkit"
  generativeUI={{
    ui: shopUI,
    errorBoundary: {
      onError: (info) => console.warn(info.kind, info.surfaceId, info.error.message),
      fallback: ({ retry }) => <button onClick={retry}>Try again</button>,
    },
  }}
>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

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
          Generated UI rendered in the chat or in named page targets the chat can update, with per-target component limits and failure handling.
        </p>
      </Panel>

      <Panel
        title="The page's React code, verbatim (not mounted)"
        description="Angular tabs omitted; this is a React harness."
      >
        <div className="space-y-4">
          <CodeBlock filename="page code" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="page code" language="css" code={BLOCK_1} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_2} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_3} />
        </div>
      </Panel>
    </>
  );
}
