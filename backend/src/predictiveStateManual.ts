/**
 * Custom graph backing Predictive State Updates — manual-emission variant.
 *
 * https://docs.copilotkit.ai/deepagents/shared-state/predictive-state-updates?agent-type=custom-graph&state-emission=manual-emission
 *
 * Not a Deep Agent. This variant is explicitly for people who "define the nodes
 * and edges myself", and the page's TypeScript tab prints the whole thing —
 * the annotation, the node, the `StateGraph` wiring and the `compile`. That is
 * the difference from the Python tab, which shows a bare node with no graph
 * around it and is reference-only in the Python sibling repo. Here it runs.
 *
 * Three changes, all forced:
 *
 * 1. `observed_steps` is wrapped in `zodState`... except it is not, because
 *    this variant uses `Annotation.Root` rather than a Zod schema. Annotations
 *    serialize fine on their own, so nothing is needed — noted only because the
 *    prebuilt variant on the same page does need `zodState`.
 * 2. Model: since the 2026-11 doc sync the page builds
 *    `new ChatOpenAI({ modelKwargs: { reasoning_effort: "none" }, model: "gpt-6-luna" })`
 *    (was `{ model: "gpt-4o-mini" }`). That line is copied verbatim: the new
 *    `reasoning_effort` kwarg is rejected by non-reasoning models such as this
 *    repo's `OPENAI_MODEL` default `gpt-4o`, so the old "read OPENAI_MODEL"
 *    substitution no longer composes with the page's code. The graph now needs
 *    an OpenAI key with `gpt-6-luna` access.
 * 3. `MemorySaver` is imported from `@langchain/langgraph` on the page. In
 *    1.4.9 it lives in `@langchain/langgraph-checkpoint`, re-exported from the
 *    root — so the page's import works, and is kept.
 */

//#region agent-state
import { Annotation } from "@langchain/langgraph";
import { CopilotKitStateAnnotation } from "@copilotkit/sdk-js/langgraph";

// Define your custom state by combining CopilotKitStateAnnotation with your fields
const AgentStateAnnotation = Annotation.Root({
    ...CopilotKitStateAnnotation.spec,
    // @ts-expect-error — the page's snippet. `Annotation<T>(config)` requires a
    // `value` reducer alongside `default`; passing `default` alone is
    // TS2345. Left as printed — see the route page.
    observed_steps: Annotation<string[]>({ default: () => [] }), // Array of completed steps
});


export type AgentState = typeof AgentStateAnnotation.State;
//#endregion

//#region chat-node
import { copilotkitEmitState } from "@copilotkit/sdk-js/langgraph";
import type { RunnableConfig } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";


// Define your custom graph node
async function chatNode(state: AgentState, config: RunnableConfig) {
  const model = new ChatOpenAI({ modelKwargs: { reasoning_effort: "none" }, model: "gpt-6-luna" });

    const steps = [
        "Analyzing input data...",
        "Identifying key patterns...",
        "Generating recommendations...",
        "Formatting final output...",
    ];
    // Emit intermediate state updates as steps complete
    for (const step of steps) {
        state.observed_steps = [...(state.observed_steps ?? []), step];
        await copilotkitEmitState(config, state); 
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // Call the model and return the response
    const response = await model.invoke(
        [new SystemMessage("You are a helpful assistant."), ...(state.messages ?? [])],
        config
    );
    return {
        messages: [response],
        observed_steps: state.observed_steps, // Persist the final state
    };
}
//#endregion

//#region graph
// Create and compile the graph
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";

const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("chat_node", chatNode)
  .addEdge(START, "chat_node")
  .addEdge("chat_node", END);

// Compile the graph with a checkpointer for persistence
const memory = new MemorySaver();
export const graph = workflow.compile({
  checkpointer: memory,
});
//#endregion
