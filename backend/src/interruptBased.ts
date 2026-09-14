/**
 * Agents backing the Interrupt-based route.
 *
 * https://docs.copilotkit.ai/deepagents/generative-ui/your-components/interrupt-based
 * (TypeScript tab)
 *
 * Two agents, one per section of the page:
 *
 * - `agent` — the Implementation walkthrough. `agentNameMiddleware.beforeModel`
 *   calls `interrupt` once, with a plain string, until the state carries a name.
 *   This one is the page's TypeScript verbatim.
 * - `multiAgent` — the "Condition UI executions" section. Two interrupt types
 *   (`ask` and `approval`) carrying a `type` the frontend's
 *   `useInterrupt({ enabled })` predicates dispatch on.
 *
 * `multiAgent` is no longer the page's snippet, and the departure is the point
 * of this route now. As printed, the page raises its `approval` interrupt from
 * `beforeModel` with a hardcoded `"please approve"` and no guard, so every
 * model call in the run — including the one that follows the approval — stops
 * again for another approval, and the thing being approved is never named. It
 * demonstrates `enabled` and nothing else.
 *
 * The approval here is instead a governed action, in the shape the Governed
 * Actions page defines:
 *
 *   https://docs.copilotkit.ai/deepagents/human-in-the-loop/governed-actions
 *
 * A `wrapToolCall` hook intercepts the `send_email` tool, runs the outbound
 * policy server-side, and interrupts with the page's `GovernedAction`
 * envelope — id, summary, tool, reference, verdict, arguments. The tool runs
 * only when the resume payload approves *that* action id and policy reference.
 * The `ask` interrupt is unchanged from the page, so the `enabled` dispatch the
 * section is about is still what the route exercises.
 *
 * Note the TypeScript tab is the cleaner of the two languages here: the Python
 * tab needs an `AgentMiddleware` subclass with an explicit `state_schema`,
 * while `createMiddleware` carries the schema and the hook together.
 *
 * The page's "Make your agent aware of interruptions" section does not work at
 * @copilotkit/sdk-js 1.66.2, and it is reproduced here rather than corrected so
 * the route shows what the page currently teaches. Measured, with a fake model
 * capturing the request the model would have received:
 *
 *   `exposeState` is applied in the CopilotKit middleware's own
 *   `wrapModelCall`, reading `request.state`. That object is scoped to the
 *   *declaring* middleware's `stateSchema`, so the CopilotKit middleware —
 *   which declares `copilotKitStateSchema` — sees `messages` and `copilotkit`
 *   and nothing else. `agentName` is declared on `agentNameMiddleware`, a
 *   different middleware, so it is invisible and no state note is built. A
 *   probe middleware declaring `agentName` itself reads it fine at the same
 *   point, which is what pins the cause to schema scoping rather than ordering:
 *   the system prompt is unchanged with the middleware first, last, and with
 *   `exposeState: true`.
 *
 * So the run resumes with the name in thread state and the frontend renders it,
 * but the model is not told what it is. `sharedState.ts` hit the same wall from
 * the other direction and carries the same note.
 */

//#region single-interrupt
import { createCopilotkitMiddleware, zodState } from "@copilotkit/sdk-js/langgraph";
import { createMiddleware } from "langchain";
import { interrupt } from "@langchain/langgraph";
import { z } from "zod";

export const agentNameMiddleware = createMiddleware({
  name: "AgentState",
  stateSchema: z.object({
    // zodState keeps this custom field in AG-UI state snapshots.
    agentName: zodState(z.string().optional()),
  }),
  beforeModel: (state) => {
    if (!state.agentName) {
      // Interrupt and wait for the user to respond with a name
      const name: string = interrupt("Before we start, what would you like to call me?");
      return { agentName: name };
    }
    return undefined;
  },
});

const stateAwareCopilotKitMiddleware = createCopilotkitMiddleware({
  exposeState: ["agentName"],
});
//#endregion

//#region governed-action
import { ToolMessage, tool } from "langchain";

/**
 * The approval envelope the Governed Actions page defines, unchanged:
 * https://docs.copilotkit.ai/deepagents/human-in-the-loop/governed-actions
 *
 * Small, serializable and vendor-neutral, so it survives the trip through
 * LangGraph's interrupt value and AG-UI's `Interrupt.metadata` intact.
 */
export type GovernedAction = {
  id: string;
  summary: string;
  tool: string;
  reference: string;
  verdict: "allow" | "deny" | "require_approval";
  arguments: Record<string, unknown>;
};

/** What the browser sends back through `resolve`. */
type ApprovalResponse = {
  approved: boolean;
  actionId: string;
  reference: string;
};

/**
 * `cancel()` — which the approval card calls for a policy `deny` — resumes with
 * this sentinel rather than a payload. It is the AG-UI LangGraph adapter's, not
 * ours: `buildCommandResumeFromAgui` writes `{ __agui_cancelled__: true,
 * interrupt_id }` for a `status: "cancelled"` resume entry.
 */
const AGUI_CANCELLED_KEY = "__agui_cancelled__";

const INTERNAL_DOMAIN = "acme.internal";
const BLOCKED_DOMAINS = new Set(["competitor.example"]);

/**
 * The policy engine, such as it is.
 *
 * Deliberately server-side: the page's first guardrail is that the verdict is
 * decided before the approval is presented, not in the browser. The card the
 * frontend renders only reports this verdict — it never computes one.
 */
function evaluateEmailPolicy(
  to: string,
): Pick<GovernedAction, "verdict" | "reference"> {
  const domain = to.split("@")[1]?.toLowerCase() ?? "";

  if (BLOCKED_DOMAINS.has(domain)) {
    return { verdict: "deny", reference: "policy/email/blocked-domain@v3" };
  }
  if (domain === INTERNAL_DOMAIN) {
    return { verdict: "allow", reference: "policy/email/internal-recipient@v3" };
  }
  return {
    verdict: "require_approval",
    reference: "policy/email/external-recipient@v3",
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The page's `handleApproval`, as a verdict on one resume payload.
 *
 * Approval is only honoured when the response names the same action id *and*
 * the same policy reference the proposal carried — the page's replay guardrail.
 * Both are recomputed here rather than remembered, because resuming an
 * interrupt replays the node: this hook runs again from the top and rebuilds
 * the envelope before `interrupt()` hands back the answer.
 */
function readDecision(
  action: GovernedAction,
  answer: unknown,
): { approved: boolean; reason: string } {
  if (isRecord(answer) && answer[AGUI_CANCELLED_KEY] === true) {
    return {
      approved: false,
      reason:
        `Blocked by ${action.reference}. Treat this action as terminal: ` +
        `do not send it, and do not propose the same one again.`,
    };
  }

  const response = (isRecord(answer) ? answer : {}) as Partial<ApprovalResponse>;

  if (response.approved !== true) {
    return {
      approved: false,
      reason: `The user rejected this action (${action.reference}). Ask what to change before proposing it again.`,
    };
  }

  if (response.actionId !== action.id || response.reference !== action.reference) {
    return {
      approved: false,
      reason:
        "The approval did not match this action's id and policy reference, so it was not executed.",
    };
  }

  return { approved: true, reason: "" };
}

/**
 * The side effect itself, left ungoverned on purpose — the gate belongs in the
 * middleware, not in the tool. Nothing here sends mail; it reports what a real
 * write API would have done.
 */
const sendEmail = tool(
  async ({ to, subject }) => `Sent "${subject}" to ${to}.`,
  {
    name: "send_email",
    description:
      "Send an email on the user's behalf. Outbound policy is checked before the call runs.",
    schema: z.object({
      to: z.string().describe("Recipient address, e.g. dana@acme.internal"),
      subject: z.string().describe("Subject line"),
      body: z.string().describe("Message body"),
    }),
  },
);
//#endregion

//#region multi-interrupt
export const approvalAndNameMiddleware = createMiddleware({
  name: "GovernedActionState",
  stateSchema: z.object({
    agentName: zodState(z.string().optional()),
  }),

  // The page's `ask` interrupt, unchanged. Guarded by state so it fires once.
  beforeModel: (state) => {
    if (!state.agentName) {
      return {
        agentName: interrupt({
          type: "ask",
          content: "Before we start, what would you like to call me?",
        }),
      };
    }
    return undefined;
  },

  // The `approval` interrupt, now attached to the action it is approving.
  wrapToolCall: async (request, handler) => {
    if (request.toolCall.name !== sendEmail.name) {
      return handler(request);
    }

    const args = request.toolCall.args as {
      to: string;
      subject: string;
      body: string;
    };
    const policy = evaluateEmailPolicy(args.to);

    const action: GovernedAction = {
      // The tool call id, not a fresh one: it is already unique, and it is
      // stable across the replay that resuming an interrupt performs, so an
      // approval cannot be matched against a different proposal.
      id: request.toolCall.id ?? `${request.toolCall.name}:${policy.reference}`,
      summary: `Send "${args.subject}" to ${args.to}`,
      tool: request.toolCall.name,
      arguments: args,
      ...policy,
    };

    const decision = readDecision(action, interrupt({ type: "approval", action }));

    // The page's last guardrail: the proposal, the verdict, the user's decision
    // and the outcome all land somewhere auditable.
    console.log("[governed-action]", {
      id: action.id,
      tool: action.tool,
      reference: action.reference,
      verdict: action.verdict,
      executed: decision.approved,
    });

    if (!decision.approved) {
      return new ToolMessage({
        content: decision.reason,
        tool_call_id: action.id,
        name: action.tool,
      });
    }

    return handler(request);
  },
});
//#endregion

//#region agents
import { createDeepAgent } from "deepagents";

import { MODEL } from "./shared.js";

// The page's prompt, which leans on the state note `exposeState` is meant to
// add. It does not arrive — see the note at the top of this file — so the model
// only knows the name from the conversation, not from state.
const SYSTEM_PROMPT =
  "You are a helpful assistant. After the user chooses a name, " +
  "Current agent state contains agentName. Use that value as your own name.";

export const agent = createDeepAgent({
  model: MODEL,
  tools: [],
  middleware: [agentNameMiddleware, stateAwareCopilotKitMiddleware],
  systemPrompt: SYSTEM_PROMPT,
});

export const multiAgent = createDeepAgent({
  model: MODEL,
  tools: [sendEmail],
  middleware: [approvalAndNameMiddleware],
  systemPrompt:
    SYSTEM_PROMPT +
    " You can send email with the send_email tool. Call it as soon as you have a " +
    "recipient, a subject and a body — never ask the user to confirm first, because " +
    "outbound policy is enforced around the call and the user is shown an approval " +
    "card there. Report the tool's result faithfully, including refusals.",
});
//#endregion
