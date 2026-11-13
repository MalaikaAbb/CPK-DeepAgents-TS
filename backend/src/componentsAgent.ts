/**
 * Components and surfaces agent.
 *
 * https://docs.copilotkit.ai/deepagents/generative-ui/components ("Add the
 * runtime and an agent")
 *
 * The page's agent is a TanStack `BuiltInAgent` on `openaiText("gpt-6-luna")`.
 * This harness runs Deep Agents only, so the same agent is built as a Deep
 * Agents graph (framework-own-agents swap, labelled): the snippet's system
 * prompt verbatim, no tools of its own (the snippet defines none), and the
 * model from `src/shared.ts` like every other graph here.
 *
 * `render_ui` and its guide are not defined here: the runtime adds them to any
 * run whose provider sends a catalog, and `copilotkitMiddleware` hands the
 * run's tools and context entries to the model — which is what the page asks
 * of a non-built-in agent ("Your agent must pass the run's tools and context
 * to its model").
 */
import { createDeepAgent } from "deepagents";
import { copilotkitMiddleware } from "@copilotkit/sdk-js/langgraph";

import { MODEL } from "./shared.js";

export const agent = createDeepAgent({
  model: MODEL,
  tools: [],
  middleware: [copilotkitMiddleware],
  // The page's prompt, verbatim.
  systemPrompt: "You are a helpful assistant. When a visual answer helps, render it with generative UI.",
});
