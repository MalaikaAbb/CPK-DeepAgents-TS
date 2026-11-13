import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import {
  BuiltInAgent,
  convertInputToTanStackAI,
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

const agent = new BuiltInAgent({
  type: "tanstack",
  factory: ({ input, abortController }) => {
    const { messages, systemPrompts, tools } = convertInputToTanStackAI(input);
    return chat({
      adapter: openaiText("gpt-6-luna"),
      messages,
      systemPrompts: [
        "You are a helpful assistant. When a visual answer helps, render it with generative UI.",
        ...systemPrompts,
      ],
      tools,
      abortController,
    });
  },
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit" });

export const GET = handler;
export const POST = handler;`;

const BLOCK_1 = `"use client";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
import "@copilotkit/react-core/v2/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
      {children}
    </CopilotKitProvider>
  );
}`;

const BLOCK_2 = `import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`;

const BLOCK_3 = `"use client";
import { CopilotChat } from "@copilotkit/react-core/v2";

export default function Page() {
  return <CopilotChat />;
}`;

const BLOCK_4 = `import { Component } from "@angular/core";
import { CopilotChat } from "@copilotkit/angular";

@Component({
  selector: "app-root",
  imports: [CopilotChat],
  template: \`<copilot-chat />\`,
})
export class App {}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

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
          Let the agent render your own React components, in the chat and in named areas of the page, through a provider-level generativeUI catalog.
        </p>
      </Panel>

      <Panel
        title="The page's React code, verbatim (not mounted)"
        description="Angular tabs omitted; this is a React harness."
      >
        <div className="space-y-4">
          <CodeBlock filename="app/api/copilotkit/[[...slug]]/route.ts" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_1} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_2} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_3} />
          <CodeBlock filename="src/app/app.ts" language="tsx" code={BLOCK_4} />
        </div>
      </Panel>
    </>
  );
}
