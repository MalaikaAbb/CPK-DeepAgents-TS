import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_ENABLED = `// what the page prints
useInterrupt({
  enabled: ({ eventValue }) => eventValue.type === 'ask',
  //          ~~~~~~~~~~~~
  //          TS2339: Property 'eventValue' does not exist
  //                  on type 'InterruptEvent<any>'.
  render: ({ event, resolve }) => (
    <AskComponent question={event.value.content} onAnswer={a => resolve(a)} />
  )
});

// what the type admits: the whole event, { name, value }
useInterrupt({
  enabled: (event) => interruptPayload(event).type === 'ask',
  render: ({ event, resolve }) => (
    <AskComponent question={String(interruptPayload(event).content)} onAnswer={a => resolve(a)} />
  )
});`;

const WIRE = `// legacy on_interrupt — the @ag-ui/langgraph default
{ "type": "CUSTOM", "name": "on_interrupt",
  "value": "{\\"type\\":\\"approval\\",\\"action\\":{…}}" }   // ← a string

// structured — emitInterruptOutcome: true
{ "type": "RUN_FINISHED",
  "outcome": { "type": "interrupt", "interrupts": [
    { "id": "e459…471", "reason": "langgraph:interrupt",
      "metadata": { "langgraph": { "raw": { "type": "approval", "action": {…} } } } }
  ] } }`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/your-components/interrupt-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Human-in-the-loop by suspending the graph rather than by asking the
          model to wait. LangGraph&apos;s <code>interrupt()</code> stops
          execution mid-hook; the value it was given is streamed to the browser,{" "}
          <code>useInterrupt</code> renders it, and <code>resolve</code> sends an
          answer back as that call&apos;s return value.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two tabs. <strong>One interrupt</strong> is the page&apos;s
          Implementation section verbatim — one <code>interrupt()</code> with a
          plain string, answered by one <code>useInterrupt</code> with no{" "}
          <code>enabled</code>. <strong>Two, dispatched by type</strong> is the
          page&apos;s &ldquo;Condition UI executions&rdquo; section, rebuilt:
          the <code>ask</code> interrupt is unchanged, and the{" "}
          <code>approval</code> one is now a real governed action in the shape
          the{" "}
          <a
            className="underline"
            href="https://docs.copilotkit.ai/deepagents/human-in-the-loop/governed-actions"
            target="_blank"
            rel="noreferrer"
          >
            Governed Actions
          </a>{" "}
          page defines. A <code>wrapToolCall</code> hook intercepts{" "}
          <code>send_email</code>, runs the outbound policy server-side, and
          interrupts with the page&apos;s envelope — id, summary, tool,
          reference, verdict, arguments.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Hello",
              'Email dana@acme.internal subject "Standup" body "Moved to 10am."',
              'Email pat@partner.example subject "Invoice" body "Please pay."',
              'Email sam@competitor.example subject "Lunch?" body "Free Thursday?"',
            ]}
            expect={
              <>
                On <strong>One interrupt</strong>: the first message you send is
                answered with a name prompt instead of a reply. Type a name,
                submit, and the run resumes with the name in thread state.
                Whether the agent then calls itself by that name is a separate
                question the page&apos;s newest section gets wrong — see the
                state-note callout below.
                <br />
                <br />
                On <strong>Two, dispatched by type</strong>: the opening turn
                draws the blue name box (<code>type: &quot;ask&quot;</code>).
                After that, each of the three email prompts takes a different
                branch of the same approval card, chosen by the policy the agent
                ran before it interrupted —{" "}
                <code>@acme.internal</code> is <strong>allow</strong> (green
                card, auto-approved, then <code>send_email · Done</code> in the
                transcript), <code>@partner.example</code> is{" "}
                <strong>require_approval</strong> (amber card with Approve and
                Reject; Reject makes the agent say it could not send and ask what
                to change), and <code>@competitor.example</code> is{" "}
                <strong>deny</strong> (red card, auto-cancelled, and the agent
                reports a policy restriction).
              </>
            }
            fail="No card at all on either tab means the agent server is down. A card that renders with a blank summary means the interrupt wire regressed to the legacy on_interrupt string — see the wire callout."
          />
        </div>
      </Panel>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/generative-ui/your-components/interrupt-based/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent"
        description="The single-interrupt middleware, the governed action it approves, the two-interrupt middleware, and the two createDeepAgent calls."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/src/interruptBased.ts", region: "single-interrupt" },
            { file: "backend/src/interruptBased.ts", region: "governed-action" },
            { file: "backend/src/interruptBased.ts", region: "multi-interrupt" },
            { file: "backend/src/interruptBased.ts", region: "agents" },
          ]}
        />
      </Panel>

      <Callout tone="success" title="This is the tab TypeScript wins on">
        <p>
          The Python tab needs an <code>AgentMiddleware</code> subclass, a
          separate <code>AgentState</code> class, and an explicit{" "}
          <code>state_schema = AgentState</code> to tie them together. It used
          to print only two of those three; the 2026-09-03 doc sync filled in
          the rest, so the gap now is the number of moving parts rather than a
          missing one. <code>createMiddleware</code> carries the state schema
          and the <code>beforeModel</code> hook in one object, so the TypeScript
          snippet is complete as written. The page now prints the{" "}
          <code>createDeepAgent</code> call that consumes it too, so the first
          section is copy-pasteable end to end.
        </p>
      </Callout>

      <Callout tone="warn" title="Three things the conditional snippet needs and does not have">
        <p>
          All three were measured against a live run. The page&apos;s
          &ldquo;Condition UI executions&rdquo; snippet fails on each of them
          independently, and this route now carries the corrected form rather
          than the printed one.
        </p>

        <p className="mt-3">
          <strong>
            1. <code>enabled</code> has no <code>eventValue</code>.
          </strong>{" "}
          Its parameter is typed <code>InterruptEvent&lt;TValue&gt;</code> —{" "}
          <code>{"{ name, value }"}</code> — so{" "}
          <code>enabled: ({"{ eventValue }"}) =&gt; …</code> is{" "}
          <code>TS2339</code> at compile time. At runtime the destructure yields{" "}
          <code>undefined</code> and reading <code>.type</code> throws;{" "}
          <code>useInterrupt</code> catches that and treats the interrupt as
          unclaimed, so neither card is drawn and the run sits at the interrupt
          with nothing to answer it.
        </p>
        <div className="mt-3">
          <CodeBlock code={DOC_ENABLED} language="tsx" />
        </div>

        <p className="mt-3">
          <strong>
            2. <code>event.value</code> is only an object on one of the two
            wires.
          </strong>{" "}
          <code>@ag-ui/langgraph</code> still defaults to the legacy{" "}
          <code>on_interrupt</code> custom event
          (<code>emitInterruptOutcome: false</code>), and it JSON-stringifies a
          non-string interrupt value on the way out — so{" "}
          <code>event.value.content</code> is <code>undefined</code> and the
          card renders blank. <code>TValue</code> defaults to <code>any</code>,
          so the compiler does not catch this one.
        </p>
        <div className="mt-3">
          <CodeBlock code={WIRE} language="json" />
        </div>
        <p className="mt-3">
          This route opts <code>interrupt_multi_agent</code> into the structured
          outcome in the runtime route, which is also what makes{" "}
          <code>cancel()</code> mean anything — on the legacy wire it only
          dismisses the card locally, with a console warning, and the Governed
          Actions page&apos;s <code>deny</code> path is built on it. The
          single-interrupt graph is deliberately left on the legacy wire so its
          tab stays true to the snippet the page prints. The demo reads both
          through one <code>interruptPayload</code> helper, so the components do
          not care which wire they are on.
        </p>

        <p className="mt-3">
          <strong>
            3. Two <code>useInterrupt</code> hooks fight over one slot.
          </strong>{" "}
          <code>renderInChat</code> defaults to true, and publishing into the
          chat goes through a single field on the CopilotKit instance
          (<code>setInterruptElement</code>) — last writer wins. With two hooks
          mounted, the second one&apos;s effect runs after the first&apos;s and
          overwrites it with <code>null</code> whenever its own predicate does
          not match, so the <em>first</em> hook&apos;s card is never shown. The
          page shows two hooks side by side and says nothing about this. The fix
          is <code>renderInChat: false</code> on both and placing the returned
          elements yourself, which is what the demo does.
        </p>
      </Callout>

      <Callout tone="info" title="Where this departs from the page, and why">
        <p>
          The <code>approval</code> interrupt is not the page&apos;s. As printed
          it is raised from <code>beforeModel</code> with a hardcoded{" "}
          <code>&quot;please approve&quot;</code> and no guard, so every model
          call in the run stops for another approval — including the one that
          follows the approval — and the thing being approved is never named. It
          demonstrates <code>enabled</code> and nothing else.
        </p>
        <p className="mt-2">
          Moving it to <code>wrapToolCall</code> attaches the approval to the
          action it is approving, which is what the Governed Actions page is
          about and what makes its guardrails testable: the policy verdict is
          computed server-side before the card is shown, the action id is the
          tool call id (stable across the replay that resuming an interrupt
          performs, so an approval cannot be matched to a different proposal),
          and the agent re-checks the id and the policy reference before the tool
          runs. The <code>ask</code> interrupt is untouched, so the{" "}
          <code>enabled</code> dispatch the section is actually about is still
          what the tab exercises.
        </p>
      </Callout>

      <Callout tone="warn" title="The state note the new section promises never arrives">
        <p>
          &ldquo;Make your agent aware of interruptions&rdquo; is new on this
          page. It wraps the custom field in <code>zodState</code>, adds{" "}
          <code>
            createCopilotkitMiddleware({"{ exposeState: [\"agentName\"] }"})
          </code>{" "}
          beside the state middleware, and writes a system prompt that refers to{" "}
          <em>Current agent state contains agentName</em>. The first two are
          real; the prompt is left describing something that is not there.
        </p>
        <p className="mt-2">
          <strong>
            <code>exposeState</code> cannot see a field declared on another
            middleware.
          </strong>{" "}
          It runs inside the CopilotKit middleware&apos;s own{" "}
          <code>wrapModelCall</code>, reading <code>request.state</code> — and
          that object is scoped to the <em>declaring</em> middleware&apos;s{" "}
          <code>stateSchema</code>. The CopilotKit middleware declares{" "}
          <code>copilotKitStateSchema</code>, so it sees <code>messages</code>{" "}
          and <code>copilotkit</code> and nothing else. <code>agentName</code>{" "}
          lives on <code>agentNameMiddleware</code>, so no state note is built
          and the system prompt reaches the model unchanged.
        </p>
        <p className="mt-2">
          Measured against <code>@copilotkit/sdk-js</code> 1.66.2 with a fake
          model capturing the request: a probe middleware that declares{" "}
          <code>agentName</code> itself reads it fine at the same point, which
          pins the cause to schema scoping rather than ordering — the prompt is
          unchanged with the middleware first, last, and with{" "}
          <code>exposeState: true</code>. The interrupt itself is unaffected:
          the run suspends, resumes, and the name lands in thread state where
          the frontend can read it.{" "}
          <a className="underline" href="/shared-state/in-app-agent-read">
            The Reading agent state route
          </a>{" "}
          hit the same wall from the other direction.
        </p>
      </Callout>

      <Callout tone="warn" title="The second state schema is elided">
        <p>
          <code>approvalAndNameMiddleware</code> is printed with both{" "}
          <code>agentName</code> and <code>approval</code> on its{" "}
          <code>stateSchema</code>, which is more than the Python tab manages —
          there the equivalent class is replaced by the comment{" "}
          <code>&quot;... your full state definition&quot;</code>. Only{" "}
          <code>agentName</code> survives here: the approval decision travels
          back as the tool&apos;s result rather than as thread state, so there
          is nothing for an <code>approval</code> field to hold.
        </p>
      </Callout>

      <Callout tone="info" title="Not implemented from this page">
        <p>
          The final section, &ldquo;Preprocessing of an interrupt and
          programmatically handling an interrupt value&rdquo;, shows a{" "}
          <code>handler</code> that resolves some interrupts without rendering.
          Its example is a department-authorisation flow built on a{" "}
          <code>getUserByEmail</code> the page never defines and an agent-side
          interrupt it never shows, so there is nothing here to drive it. The{" "}
          <code>handler</code> property itself is real API, and the card&apos;s
          auto-decision for <code>allow</code> and <code>deny</code> is the same
          idea reached from the render side.
        </p>
      </Callout>
    </>
  );
}
