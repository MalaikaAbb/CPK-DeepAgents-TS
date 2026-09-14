"use client";

import {
  CopilotChat,
  useDefaultRenderTool,
  useInterrupt,
} from "@copilotkit/react-core/v2";
import type { InterruptEvent } from "@copilotkit/react-core/v2";
import { useEffect, useRef, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const SINGLE_AGENT_ID = "interrupt_agent";
const MULTI_AGENT_ID = "interrupt_multi_agent";

//#region single-interrupt
/**
 * The page's Implementation section, verbatim: one `useInterrupt`, no
 * `enabled`, unstyled markup.
 *
 * The agent's `beforeModel` hook calls `interrupt("…")` with a plain string, so
 * `event.value` is that string and the snippet is correct as printed.
 * `resolve` sends the reply back and the run picks up where it stopped.
 *
 * `agentId` is the one addition, and the page now sanctions it: it says
 * `useInterrupt` uses whatever agent the `CopilotKit` provider configures, and
 * that `agentId` is for pointing a component at a different agent in a
 * multi-agent app. This harness serves thirteen graphs from one provider, so
 * every registration names the graph it belongs to.
 *
 * This graph is deliberately left on the legacy `on_interrupt` wire (see
 * `STANDARD_INTERRUPT_GRAPHS` in the runtime route) so the snippet stays true
 * to the page. The governed tab below opts into structured interrupts instead.
 */
function SingleInterruptChat() {
  useInterrupt({
    agentId: SINGLE_AGENT_ID,
    render: ({ event, resolve }) => (
        <div>
            <p>{event.value}</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                resolve((e.target as HTMLFormElement).response.value);
            }}>
                <input type="text" name="response" placeholder="Enter your response" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
});

  return <CopilotChat agentId={SINGLE_AGENT_ID} className="h-full" />;
}
//#endregion

//#region governed-action-types
/**
 * The Governed Actions page's envelope, unchanged:
 * https://docs.copilotkit.ai/deepagents/human-in-the-loop/governed-actions
 *
 * The agent builds one of these server-side — verdict included — and the card
 * below only reports it. Nothing here decides policy.
 */
type GovernedAction = {
  id: string;
  summary: string;
  tool: string;
  reference: string;
  verdict: "allow" | "deny" | "require_approval";
  arguments: Record<string, unknown>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The object the agent passed to `interrupt()`, whichever wire carried it.
 *
 * The page writes `event.value.content` and leaves it there, which only holds
 * on one of the two channels `@ag-ui/langgraph` can use:
 *
 *   - **structured** (this tab, `emitInterruptOutcome: true`) — `event.value`
 *     is an AG-UI `Interrupt`, and the agent's own value is preserved under
 *     `metadata.langgraph.raw`.
 *   - **legacy `on_interrupt`** (the adapter's default) — the adapter
 *     JSON-stringifies a non-string value, so `event.value` is a *string* and
 *     `event.value.content` is `undefined`.
 *
 * Reading through this helper covers both, so flipping the graph between wires
 * does not change the components.
 */
function interruptPayload(event: InterruptEvent): Record<string, unknown> {
  const { value } = event;

  if (isRecord(value)) {
    const langgraph = isRecord(value.metadata) ? value.metadata.langgraph : undefined;
    const raw = isRecord(langgraph) ? langgraph.raw : undefined;
    if (raw !== undefined) return isRecord(raw) ? raw : { content: raw };
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return isRecord(parsed) ? parsed : { content: parsed };
    } catch {
      return { content: value };
    }
  }

  return {};
}

/** `enabled` receives the whole event — `{ name, value }` — not a destructurable `eventValue`. */
const isType = (type: string) => (event: InterruptEvent) =>
  interruptPayload(event).type === type;
//#endregion

//#region conditional-interrupts
const AskComponent = ({
  question,
  onAnswer,
}: {
  question: string;
  onAnswer: (answer: string) => void;
}) => (
  <div className="rounded-lg border border-sky-300 bg-sky-50 p-3 text-sm dark:border-sky-800 dark:bg-sky-950/40">
    <p className="text-slate-800 dark:text-slate-100">{question}</p>
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onAnswer((e.target as HTMLFormElement).response.value);
      }}
    >
      <input
        type="text"
        name="response"
        placeholder="Enter your response"
        className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
      />
      <button
        type="submit"
        className="rounded-md bg-[var(--accent)] px-3 py-1 font-medium text-white"
      >
        Submit
      </button>
    </form>
  </div>
);

const VERDICT_STATUS: Record<GovernedAction["verdict"], string> = {
  allow: "Allowed by policy",
  deny: "Blocked by policy",
  require_approval: "User approval required",
};

const VERDICT_TONE: Record<GovernedAction["verdict"], string> = {
  allow: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40",
  deny: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40",
  require_approval:
    "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40",
};

/**
 * The page's `GovernedActionCard`, with one change the page needs and does not
 * make: the auto-decision effect is fired once per action.
 *
 * The page's version has `[action.id, action.verdict]` deps and calls
 * `onApprove()` / `onBlock()` straight out of the effect body. React 19's
 * StrictMode runs every effect twice on mount in development, so an `allow`
 * would resume the run twice from one card. The ref keeps it to one.
 */
function GovernedActionCard({
  action,
  onApprove,
  onReject,
  onBlock,
}: {
  action: GovernedAction;
  onApprove: () => void;
  onReject: () => void;
  onBlock: () => void;
}) {
  const decided = useRef<string | null>(null);

  useEffect(() => {
    if (action.verdict === "require_approval") return;
    if (decided.current === action.id) return;
    decided.current = action.id;

    if (action.verdict === "allow") onApprove();
    if (action.verdict === "deny") onBlock();
    // The page's deps. The callbacks close over `resolve`/`cancel`, which are
    // stable for as long as one interrupt is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action.id, action.verdict]);

  return (
    <section className={`rounded-lg border p-4 text-sm shadow-sm ${VERDICT_TONE[action.verdict]}`}>
      <div className="space-y-1">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {VERDICT_STATUS[action.verdict]}
        </p>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {action.summary}
        </h3>
        <p className="text-slate-600 dark:text-slate-300">Tool: {action.tool}</p>
        <p className="text-slate-600 dark:text-slate-300">
          Reference: {action.reference}
        </p>
      </div>

      <pre className="mt-3 max-h-32 overflow-auto rounded bg-white/70 p-3 text-xs text-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
        {JSON.stringify(action.arguments, null, 2)}
      </pre>

      {action.verdict === "require_approval" ? (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="rounded-md bg-emerald-600 px-3 py-1 font-medium text-white"
          >
            Approve and run
          </button>
          <button
            type="button"
            onClick={onReject}
            className="rounded-md bg-rose-600 px-3 py-1 font-medium text-white"
          >
            Reject
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Decided by the server-side policy, not by you — the run was resumed
          automatically and this card is the audit note.
        </p>
      )}
    </section>
  );
}

/**
 * The page's "Condition UI executions" section, made to work.
 *
 * Two `useInterrupt` registrations against one agent, each claiming the
 * interrupts its `enabled` predicate matches. Three things differ from the
 * snippet the page prints, and all three are load-bearing:
 *
 *  1. `enabled` takes the whole event. The page destructures an `eventValue`
 *     the type does not have (`InterruptEvent` is `{ name, value }`), which is
 *     `TS2339` at compile time and a throw at runtime — the hook catches it and
 *     treats the interrupt as unclaimed, so neither card ever appears.
 *  2. The value is read through `interruptPayload`, because what `event.value`
 *     holds depends on which interrupt wire the graph is on.
 *  3. `renderInChat: false`, and the elements are placed by hand.
 *     `renderInChat` defaults to true, and publishing into the chat goes
 *     through one shared slot on the CopilotKit instance
 *     (`setInterruptElement`) — last writer wins. With two hooks mounted, the
 *     second one's effect runs after the first's and overwrites it with `null`
 *     whenever its own predicate does not match, so the *first* hook's card is
 *     never shown. Opting out of the in-chat slot is what lets both coexist.
 */
function GovernedActionsChat() {
  // The built-in tool card, so `send_email` and whatever the gate returned for
  // it — the send, or the refusal text — are visible in the transcript rather
  // than only in the model's paraphrase of them.
  useDefaultRenderTool();

  const askElement = useInterrupt({
    agentId: MULTI_AGENT_ID,
    renderInChat: false,
    enabled: isType("ask"),
    render: ({ event, resolve }) => (
      <AskComponent
        question={String(interruptPayload(event).content ?? "")}
        onAnswer={(answer) => resolve(answer)}
      />
    ),
  });

  const approvalElement = useInterrupt({
    agentId: MULTI_AGENT_ID,
    renderInChat: false,
    enabled: isType("approval"),
    render: ({ event, resolve, cancel }) => {
      const action = interruptPayload(event).action as GovernedAction | undefined;
      if (!action) return <></>;

      // The page's resume contract: the id and the policy reference travel back
      // with the answer so the agent can refuse an approval that was issued for
      // some other proposal.
      const answer = (approved: boolean) => () =>
        void resolve({
          approved,
          actionId: action.id,
          reference: action.reference,
        });

      return (
        <GovernedActionCard
          action={action}
          onApprove={answer(true)}
          onReject={answer(false)}
          // `deny` is terminal — the run is cancelled rather than answered.
          // `cancel()` needs the structured interrupt wire; on the legacy
          // `on_interrupt` channel it only dismisses the card locally.
          onBlock={() => void cancel()}
        />
      );
    },
  });

  const pending = askElement ?? approvalElement;

  return (
    <div className="flex h-full flex-col">
      {/* Above the chat, not below it. Two reasons, and the second is the one
          that bites: the open interrupt is the thing asking for attention, so
          it belongs at the top — and anything pinned to the bottom edge of the
          viewport can end up under a fixed overlay. The screen recorder draws a
          48px taskbar at `bottom: 0`, which covered this card's buttons and
          swallowed every click on them. */}
      {pending && (
        <div className="max-h-[45%] shrink-0 overflow-auto border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
          {pending}
        </div>
      )}
      <div className="min-h-0 flex-1">
        <CopilotChat agentId={MULTI_AGENT_ID} className="h-full" />
      </div>
    </div>
  );
}
//#endregion

export default function Page() {
  const [variant, setVariant] = useState<"single" | "governed">("single");

  return (
    <DemoFrame
      parentPath="/generative-ui/your-components/interrupt-based"
      subtitle={`graph: ${variant === "single" ? SINGLE_AGENT_ID : MULTI_AGENT_ID}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(
            [
              ["single", "One interrupt"],
              ["governed", "Two, dispatched by type"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setVariant(id)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                variant === id
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          {/* Keyed so switching tears the old chat down: the two variants
              register different `useInterrupt` handlers against different
              agents, and leaving both mounted would leave both registered. */}
          {variant === "single" ? (
            <SingleInterruptChat key="single" />
          ) : (
            <GovernedActionsChat key="governed" />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
