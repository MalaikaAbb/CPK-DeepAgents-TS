/**
 * Agent backing the Reading / Writing agent state routes.
 *
 * https://docs.copilotkit.ai/deepagents/shared-state/in-app-agent-read
 * https://docs.copilotkit.ai/deepagents/shared-state/in-app-agent-write
 *
 * Both pages print the same TypeScript — one middleware with a `language`
 * field — and differ only in what the frontend does with it: read it, or write
 * it back with `agent.setState`. One agent serves both routes.
 *
 * `zodState`, which these pages DO use, is load-bearing. Its own docstring
 * explains why: without it a field is dropped from the graph's `output_schema`
 * and AG-UI filters it out of `STATE_SNAPSHOT`, so `useAgent().state.language`
 * would stay undefined in the browser even though the thread state has it.
 *
 * What neither page addresses is that reading state is not the same as the
 * model seeing it. `createCopilotkitMiddleware({ exposeState })` looks like the
 * answer — it serialises named state keys into the system prompt — but it
 * cannot work in this composition, verified against a live run:
 *
 *   `exposeState` is applied inside the CopilotKit middleware's own
 *   `wrapModelCall`, from `request.state`. That object is scoped to the
 *   *declaring* middleware's `stateSchema`, so it holds only `messages` and
 *   `copilotkit` here — `language` is declared on `languageStateMiddleware`,
 *   a different middleware, and is therefore invisible to it. The note is
 *   never built, with `exposeState: ["language"]` or `exposeState: true`.
 *
 * So this file uses the plain `copilotkitMiddleware` singleton the pages name.
 * State round-trips correctly in both directions — which is what the two pages
 * are actually about — but the model does not change language. See the Writing
 * route for the measurement.
 */

//#region agent-state
import { createMiddleware } from "langchain";
import { copilotkitMiddleware, zodState } from "@copilotkit/sdk-js/langgraph";
import { z } from "zod";

export const languageStateMiddleware = createMiddleware({
  name: "AgentState",
  stateSchema: z.object({
    language: zodState(z.enum(["english", "spanish"]).default("english")),
  }),
});

// Compose with copilotkitMiddleware when constructing the agent:
// createDeepAgent({ middleware: [languageStateMiddleware, copilotkitMiddleware], ... })
//#endregion

//#region set-language-tool
/**
 * Not on either doc page — glue, and the Reading route does not demonstrate
 * anything without it.
 *
 * Both pages show a `language` field and a UI that reflects it, but neither
 * shows what ever *writes* it from the agent's side. The Writing route has the
 * browser's `agent.setState` for that; the Reading route has nothing, so
 * "Switch to Spanish" only ever changed the prose. The field stayed `english`
 * and the panel the page exists to demonstrate never moved.
 *
 * A `Command` is what makes the write survive the node boundary — the same
 * correction the State Rendering and Predictive State Updates routes carry. The
 * `ToolMessage` has to travel with it: a `Command` replaces the tool's ordinary
 * return value, and OpenAI rejects a `tool_call` with no matching result.
 */
import { ToolMessage } from "@langchain/core/messages";
import { tool, type ToolRuntime } from "@langchain/core/tools";
import { Command } from "@langchain/langgraph";

const SetLanguageSchema = z.object({
  language: z.enum(["english", "spanish"]),
});

const setLanguage = tool(
  (
    input: { language: "english" | "spanish" },
    runtime: ToolRuntime<typeof SetLanguageSchema>,
  ) =>
    new Command({
      update: {
        language: input.language,
        messages: [
          new ToolMessage({
            content: `Language set to ${input.language}.`,
            tool_call_id: runtime.toolCallId,
          }),
        ],
      },
    }),
  {
    name: "set_language",
    description:
      "Set the conversation language in shared agent state. Call this whenever " +
      "the user asks to switch language.",
    schema: SetLanguageSchema,
  },
);
//#endregion

//#region agent
import { createDeepAgent } from "deepagents";

import { MODEL } from "./shared.js";

export const agent = createDeepAgent({
  model: MODEL,
  tools: [setLanguage],
  middleware: [languageStateMiddleware, copilotkitMiddleware],
  systemPrompt:
    "You are a helpful assistant. Always answer in the language named by " +
    "the `language` value in the current agent state. When the user asks to " +
    "switch language, call `set_language` first, then reply in that language. " +
    "Answer directly — do not use the file system or planning tools.",
});
//#endregion
