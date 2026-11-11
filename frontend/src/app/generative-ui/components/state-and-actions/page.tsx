import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `const cartSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
});

export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  state: { cart: cartSchema },
  components: {
    ProductCard: {
      component: ProductCard,
      props: z.object({ productId: z.string(), name: z.string(), inCart: z.number() }),
      bind: {
        inCart: (state, { productId }) =>
          state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0,
      },
    },
  },
});`;

const BLOCK_1 = `functions: {
  addToCart: { parameters: z.object({ productId: z.string() }), allowedCallers: "rendererOrAgent", returnType: "object" },
  track: { parameters: z.object({ event: z.string() }), returnType: "void" },
  reload: { parameters: z.object({}), allowedCallers: "agentOnly" },
},`;

const BLOCK_2 = `events: {
  onChoose: {
    description: "The user picked a plan",
    parameters: z.object({ plan: z.string() }),
  },
},`;

const BLOCK_3 = `import { useGenerativeUIState } from "@copilotkit/react-core/v2/generative-ui";

function CartState({ cart }: { cart: Cart }) {
  useGenerativeUIState(shopUI, "cart", { items: cart.items });
  return null;
}`;

const BLOCK_4 = `export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  functions: {
    addToCart: {
      description: "Add a product to the cart",
      parameters: z.object({ productId: z.string(), quantity: z.number().default(1) }),
    },
  },
  components: {
    ProductCard: {
      component: ProductCard,
      props: z.object({ productId: z.string(), name: z.string() }),
      events: { onAddToCart: {} },
    },
  },
});`;

const BLOCK_5 = `import { useState } from "react";
import type { GenerativeUIComponentProps } from "@copilotkit/react-core/v2/generative-ui";

function ProductCard({ productId, name, onAddToCart }: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  const [error, setError] = useState<string>();
  return (
    <article>
      <h4>{name}</h4>
      <button
        onClick={async () => {
          const result = await onAddToCart?.({ productId });
          if (result && !result.ok) setError(result.error.message);
        }}
      >
        Add to cart
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </article>
  );
}`;

const BLOCK_6 = `function CheckoutForm({ email, setEmail }: GenerativeUIComponentProps<typeof shopUI, "CheckoutForm">) {
  return <input value={email ?? ""} onChange={(event) => setEmail(event.target.value)} />;
}`;

const BLOCK_7 = `import { useGenerativeUIFunction } from "@copilotkit/react-core/v2/generative-ui";

function CartActions({ cart }: { cart: Cart }) {
  useGenerativeUIFunction(shopUI, "addToCart", ({ productId, quantity }) => {
    cart.addItem(productId, quantity);
    return { added: productId };
  });
  return null;
}`;

const BLOCK_8 = `import { Component, inject } from "@angular/core";
import { registerGenerativeUIFunction } from "@copilotkit/angular/generative-ui";
import { CartStore } from "./cart.store";
import { shopUI } from "./shop-ui";

@Component({ /* ... */ })
export class CartActions {
  readonly #cart = inject(CartStore);

  constructor() {
    registerGenerativeUIFunction(shopUI, "addToCart", ({ productId, quantity }) => {
      this.#cart.addItem(productId, quantity);
      return { added: productId };
    });
  }
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

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
          Live app data inside generated UI, click handlers that run your code or message the agent, browser-side computed values, and kept user input.
        </p>
      </Panel>

      <Panel
        title="The page's React code, verbatim (not mounted)"
        description="Angular tabs omitted; this is a React harness."
      >
        <div className="space-y-4">
          <CodeBlock filename="page code" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_1} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_2} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_3} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_4} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_5} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_6} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_7} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_8} />
        </div>
      </Panel>
    </>
  );
}
