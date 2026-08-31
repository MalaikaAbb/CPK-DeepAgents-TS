/**
 * Agent backing the Predictive State Updates route — prebuilt-agent variant.
 *
 * https://docs.copilotkit.ai/deepagents/shared-state/predictive-state-updates?agent-type=prebuilt
 *
 * `stateStreamingMiddleware` takes `stateItem` mappings from a tool argument to
 * a state key and streams the argument into that key as the model writes it —
 * no `copilotkitEmitState` call and no `copilotkitCustomizeConfig` anywhere.
 *
 * Both blocks below are the page's TypeScript verbatim, bar the model id. This
 * is the one variant of this page that needs no glue at all: unlike the Python
 * tab, the page's `createDeepAgent` call already lists `observedStepsMiddleware`
 * in its `middleware` array, so the state schema is actually attached.
 */

//#region agent-state
import { createMiddleware } from "langchain";
import { copilotkitMiddleware, zodState } from "@copilotkit/sdk-js/langgraph";
import { z } from "zod";

export const observedStepsMiddleware = createMiddleware({
  name: "AgentState",
  stateSchema: z.object({
    observed_steps: zodState(z.array(z.string()).default([])),
  }),
});
//#endregion

//#region prebuilt-agent
import { ToolMessage } from "@langchain/core/messages";
import type { ToolRuntime } from "@langchain/core/tools";
import { Command } from "@langchain/langgraph";
import { createDeepAgent } from "deepagents";
import {
  stateStreamingMiddleware,
  stateItem,
} from "@copilotkit/sdk-js/langgraph-middlewares";
import { tool } from "langchain";

import { MODEL } from "./shared.js";

const StepProgressSchema = z.object({ steps: z.array(z.string()) });

/**
 * The page prints this tool as `tool(async (args) => args, ...)`, and that is
 * exactly the shape that leaves the panel empty.
 *
 * `stateStreamingMiddleware` streams the `steps` argument into `observed_steps`
 * while the model is still writing it, but a streamed value is a *prediction*:
 * it lives on the run, not in the thread. When the node returns, LangGraph
 * writes the node's own update over it, and a tool that returns its arguments
 * contributes no `observed_steps` — so the key reverts to its `[]` default the
 * moment the stream ends. Measured: the list filled during generation and was
 * blank again by the time the reply finished.
 *
 * Returning a `Command` is what makes the prediction stick, and it is the same
 * correction the Tool Rendering and custom-graph variants of this page already
 * carry. The `ToolMessage` is mandatory alongside it: a `Command` replaces the
 * tool's normal return value, so without one OpenAI sees a `tool_call` with no
 * matching result and rejects the next turn.
 */
const stepProgressTool = tool(
  (
    input: { steps: string[] },
    runtime: ToolRuntime<typeof StepProgressSchema>,
  ) =>
    new Command({
      update: {
        observed_steps: input.steps,
        messages: [
          new ToolMessage({
            content: "Steps recorded to shared state.",
            tool_call_id: runtime.toolCallId,
          }),
        ],
      },
    }),
  {
    name: "step_progress_tool",
    description: "Reports the current steps being executed",
    schema: StepProgressSchema,
  },
);

export const agent = createDeepAgent({
  model: MODEL,
  tools: [stepProgressTool],
  middleware: [
    observedStepsMiddleware,
    copilotkitMiddleware,
    stateStreamingMiddleware(
      // Map the tool's `steps` argument into the `observed_steps` state field.
      stateItem({
        stateKey: "observed_steps",
        tool: "step_progress_tool",
        toolArgument: "steps",
      }),
    ),
  ],
  systemPrompt: "You are a task performer. Report your steps using step_progress_tool.",
});
//#endregion
