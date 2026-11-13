import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Everything the rendered Deep Agents page prints, verbatim.
const PY_AGENT = `from deepagents import create_deep_agent
from copilotkit import CopilotKitMiddleware

agent = create_deep_agent(
    model="openai:gpt-6-luna",
    tools=[],  # Backend tools go here
    middleware=[CopilotKitMiddleware()],
    system_prompt=SYSTEM_PROMPT,
)`;

const PY_PROMPT = `SYSTEM_PROMPT = """
You are a data visualization assistant.

When the user asks for a chart, call \`render_bar_chart\` with a concise
title and a \`data\` array of \`{label, value}\` items.

Keep chat responses brief and let the chart do the talking.
"""`;

const FRONTEND_IMPORTS = `import { useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";`;

const HEADLESS = `import { CopilotChatToolCallsView } from "@copilotkit/react-core/v2";

<CopilotChatToolCallsView message={assistantMessage} messages={allMessages} />;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <MissingSnippets ids={["deepagents::gen-ui-tool-based (useComponent registration)"]}>
        <p>
          The <code>useComponent(&#123; name: &quot;render_bar_chart&quot;, … &#125;)</code>{" "}
          call — the one piece of frontend code the page is about — is a
          missing snippet. Its <code>barChartPropsSchema</code> and{" "}
          <code>BarChart</code> component are not printed either.
        </p>
      </MissingSnippets>

      <Callout tone="warn" title="Backend is Python-only">
        The two backend steps (wire <code>CopilotKitMiddleware</code>, name the
        tool in the system prompt) are printed only as <code>agent.py</code>.
        There is no TypeScript tab, and this repo implements TypeScript only,
        so no agent is built from them (AGENTS.md: Python-only code is a gap,
        not something to translate). With neither the frontend registration
        nor a TypeScript agent published, the route is reference-only and{" "}
        <strong>Broken</strong>.
      </Callout>

      <Panel title="What the page describes">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Register a React component with <code>useComponent</code> (name, Zod
          props schema, render component). CopilotKit forwards it to the agent
          as a frontend tool; <code>copilotkitMiddleware</code> merges it into
          the model&apos;s tool list, and when the model calls it the chat
          renders the component with the tool arguments as props. Without a
          schema the tool is advertised with no parameters and renders with no
          props. Headless chats must paint tool calls themselves, e.g. with{" "}
          <code>CopilotChatToolCallsView</code>.
        </p>
      </Panel>

      <Panel title="Everything the rendered page prints">
        <div className="space-y-4">
          <CodeBlock filename="agent.py (Python only)" language="python" code={PY_AGENT} />
          <CodeBlock filename="agent.py (Python only)" language="python" code={PY_PROMPT} />
          <CodeBlock filename="frontend imports" language="tsx" code={FRONTEND_IMPORTS} />
          <CodeBlock filename="headless chat" language="tsx" code={HEADLESS} />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The headless fragment also uses <code>assistantMessage</code> and{" "}
          <code>allMessages</code> without defining them.
        </p>
      </Panel>
    </>
  );
}
