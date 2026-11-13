import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `import { z } from "zod";
import {
  createGenerativeUI,
  type GenerativeUIComponentProps,
} from "@copilotkit/react-core/v2/generative-ui";

function ProductGrid({ title, children }: GenerativeUIComponentProps<typeof shopUI, "ProductGrid">) {
  return (
    <section>
      {title ? <h3>{title}</h3> : null}
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function ProductCard({ name, price, imageUrl }: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  return (
    <article>
      <img src={imageUrl} alt={name} />
      <h4>{name}</h4>
      <p>\${price}</p>
    </article>
  );
}

export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  components: {
    ProductGrid: {
      component: ProductGrid,
      description: "A grid of products. Put the ids of ProductCard components in children.",
      props: z.object({ title: z.string().optional() }),
      slots: { children: "multiple" },
    },
    ProductCard: {
      component: ProductCard,
      description: "One product. Copy every value from a product of a tool result.",
      props: z.object({ name: z.string(), price: z.number(), imageUrl: z.string() }),
    },
  },
});`;

const BLOCK_1 = `import { z } from "zod";

props: z.object({ name: z.string(), price: z.number() }),`;

const BLOCK_2 = `import { createGenerativeUI, standardUI } from "@copilotkit/react-core/v2/generative-ui";

export const appUI = createGenerativeUI({
  id: "acme/app@1",
  extends: [standardUI, cartUI],
  components: { Hero: { component: Hero, props: z.object({ title: z.string() }) } },
});`;

const BLOCK_3 = `import { exportA2UICatalog } from "@copilotkit/react-core/v2/generative-ui";

const catalog = exportA2UICatalog(appUI, { title: "Acme app" });
fs.writeFileSync("acme-catalog.json", JSON.stringify(catalog, null, 2));`;

const BLOCK_4 = `import { Component, input } from "@angular/core";
import { z } from "zod";
import {
  CopilotGenerativeUIChildren,
  createGenerativeUI,
  type GenerativeUIChildren,
} from "@copilotkit/angular/generative-ui";

@Component({
  selector: "app-product-grid",
  imports: [CopilotGenerativeUIChildren],
  template: \`
    <section>
      @if (title(); as title) {
        <h3>{{ title }}</h3>
      }
      <div class="grid grid-cols-2 gap-4">
        <ng-container *copilotGenerativeUIChildren="children()" />
      </div>
    </section>
  \`,
})
export class ProductGrid {
  readonly title = input<string>();
  readonly children = input<GenerativeUIChildren>();
}

@Component({
  selector: "app-product-card",
  template: \`
    <article>
      <img [src]="imageUrl()" [alt]="name()" />
      <h4>{{ name() }}</h4>
      <p>{{ "$" + price() }}</p>
    </article>
  \`,
})
export class ProductCard {
  readonly name = input.required<string>();
  readonly price = input.required<number>();
  readonly imageUrl = input.required<string>();
}

export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  components: {
    ProductGrid: {
      component: ProductGrid,
      description: "A grid of products. Put the ids of ProductCard components in children.",
      props: z.object({ title: z.string().optional() }),
      slots: { children: "multiple" },
    },
    ProductCard: {
      component: ProductCard,
      description: "One product. Copy every value from a product of a tool result.",
      props: z.object({ name: z.string(), price: z.number(), imageUrl: z.string() }),
    },
  },
});`;

const BLOCK_5 = `function ProductCard(props: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  props.price; // number
  props.color; // type error: not a prop of ProductCard
}`;

const BLOCK_6 = `import * as v from "valibot";
import { toStandardJsonSchema } from "@valibot/to-json-schema";

props: toStandardJsonSchema(v.object({ name: v.string(), price: v.number() })),`;

const BLOCK_7 = `const ui = createGenerativeUI({
  id: "acme/panel@1",
  components: {
    Panel: {
      component: Panel,
      props: z.object({ title: z.string(), color: z.string().optional() }),
      slots: { children: "multiple" },
      parameterOrder: ["title", "children"],
    },
  },
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/catalogs" />

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
          One typed catalog declaring which components the agent may render and their props, combinable and exportable for other A2UI tools.
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
        </div>
      </Panel>
    </>
  );
}
