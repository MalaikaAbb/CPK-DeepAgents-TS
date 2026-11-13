import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every code block the rendered Deep Agents page prints, verbatim, shown as
// reference. Nothing here is mounted: see the callout.
const TS_0 = `const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {
    injectA2UITool: false,
  },
});`;
const TS_1 = `{
  "id": "book-button",
  "component": "Button",
  "child": "book-label",
  "variant": "primary",
  "action": {
    "event": {
      "name": "book_flight",
      "context": {
        "flightNumber": { "path": "flightNumber" },
        "price": { "path": "price" }
      }
    }
  }
}`;
const PY_0 = `from copilotkit import a2ui
from langchain.tools import tool
from pathlib import Path
from typing import TypedDict

class Flight(TypedDict):
    id: str
    airline: str
    airlineLogo: str
    flightNumber: str
    origin: str
    destination: str
    date: str
    departureTime: str
    arrivalTime: str
    duration: str
    status: str
    statusIcon: str
    price: str

SURFACE_ID = "flight-search-results"
FLIGHT_SCHEMA = a2ui.load_schema(
    Path(__file__).parent / "a2ui" / "schemas" / "flight_schema.json"
)


@tool
def search_flights(flights: list[Flight]) -> str:
    """Search for flights and display results as rich cards."""
    return a2ui.render(
        operations=[
            a2ui.create_surface(SURFACE_ID),
            a2ui.update_components(SURFACE_ID, FLIGHT_SCHEMA),
            a2ui.update_data_model(SURFACE_ID, {"flights": flights}),
        ],
    )`;
const PY_1 = `from deepagents import create_deep_agent
from src.a2ui_fixed_schema import search_flights

agent = create_deep_agent(
    tools=[search_flights, ...],
    ...
)`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Callout tone="warn" title="Agent side is Python-only for Deep Agents">
        <p>
          The tool and agent are Python only, and the <code>main.py</code> snippet is elided (<code>tools=[search_flights, ...]</code>, <code>...</code>). <code>flight_schema.json</code> itself is not printed (only one button entry from it), and the runtime registers an undefined <code>myAgent</code>. This repo implements the TypeScript variant only and does
          not translate Python (AGENTS.md), and without an agent the
          TypeScript runtime snippets have nothing to serve. Reference-only, 
          <strong>Broken</strong>.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>The schema is written ahead of time as JSON (<code>flight_schema.json</code>); a backend tool loads it and returns <code>a2ui.render</code> operations that create the surface, set its components and fill its data model.</li>
          <li>Because the agent supplies the schema, the runtime turns the injected tool off (<code>injectA2UITool: false</code>).</li>
          <li>Buttons carry an <code>action.event</code> whose <code>context</code> binds data-model paths, so a click sends e.g. the flight number and price back.</li>
        </ul>
      </Panel>

      <Panel title="Everything the rendered page prints">
        <div className="space-y-4">
          <CodeBlock filename={`app/api/copilotkit/route.ts`} language="tsx" code={TS_0} />
          <CodeBlock filename={`button with action context (schema JSON)`} language="json" code={TS_1} />
          <CodeBlock filename={`search_flights tool (Python) — Python only`} language="python" code={PY_0} />
          <CodeBlock filename={`apps/agent/main.py — Python only`} language="python" code={PY_1} />
        </div>
      </Panel>
    </>
  );
}
