import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `<CopilotKitProvider
  runtimeUrl="/api/copilotkit"
  generativeUI={{
    ui: standardUI,
    theme: {
      "--a2ui-color-accent": "#d97706",
      "--a2ui-font-family": "Inter, sans-serif",
      "--a2ui-radius-md": "10px",
    },
  }}
>`;

const BLOCK_1 = `import type { GenerativeUITheme } from "@copilotkit/react-core/v2/generative-ui";

export const theme: GenerativeUITheme = { "--a2ui-color-accent": "#d97706" };`;

const BLOCK_2 = `.a2ui-surface {
  --a2ui-color-accent: #d97706;
}`;

const BLOCK_3 = `import type { GenerativeUITheme } from "@copilotkit/angular/generative-ui";

export const theme: GenerativeUITheme = { "--a2ui-color-accent": "#d97706" };`;

const BLOCK_4 = `const colorSchemeScript = \`(() => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => document.documentElement.classList.toggle("dark", media.matches);
  apply();
  media.addEventListener("change", apply);
})();\`;

<head>
  <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
</head>;`;

const BLOCK_5 = `theme: {
  "--a2ui-color-accent": "#d97706",
  dark: {
    "--a2ui-color-panel": "#1f2937",
    "--a2ui-color-surface": "#111827",
  },
},`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/theming" />

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
          Colors, fonts and dark mode for the standard components through CSS variables.
        </p>
      </Panel>

      <Panel
        title="The page's React code, verbatim (not mounted)"
        description="Angular tabs omitted; this is a React harness."
      >
        <div className="space-y-4">
          <CodeBlock filename="page code" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_1} />
          <CodeBlock filename="page code" language="css" code={BLOCK_2} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_3} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_4} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_5} />
        </div>
      </Panel>
    </>
  );
}
