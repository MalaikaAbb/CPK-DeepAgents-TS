# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-11

### 14:09 UTC — 11 pages, highest severity high

**High — Introduction**

`/deepagents` · routes `/`, `/doc-sync` · under “Introduction”

45 prose lines changed. The number of fenced code blocks changed.

````diff
- {/* TODO: swap feature-viewer URLs back to /deepagents/ once the dojo supports that route */}
+ 
- frameworkIcon={<DeepAgentsIcon className="h-14 w-14" />}
+ frameworkIcon={<DeepAgentsIcon className="h-12 w-12" />}
- subheader="Give your Deep Agents real user-interactivity using CopilotKit and AG-UI. Build rich, interactive, agent-powered applications with LangChain's Deep Agents framework."
- bannerVideo="https://cdn.copilotkit.ai/docs/copilotkit/videos/coagents/overview.mp4"
+ subheader="Deep Agents runs your agent. CopilotKit gives it a surface your users can see, interrupt and steer."
- featuresLink="https://feature-viewer.copilotkit.ai/langgraph/feature/agentic_chat"
````

**High — State Rendering**

`/deepagents/generative-ui/state-rendering` · route `/generative-ui/state-rendering` · under “Build an agent that produces state” · in a `python` block

5 code lines changed.

````diff
+ from langchain_openai import ChatOpenAI
- model="openai:gpt-5.4",
+ model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
- model: "openai:gpt-5.4",
+ model: "openai:gpt-6-luna",
````

**High — Tool Rendering**

`/deepagents/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Give your agent a tool to call” · in a `python` block

5 code lines changed.

````diff
+ from langchain_openai import ChatOpenAI
- model="openai:gpt-4o",
+ model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
- model: "openai:gpt-4o",
+ model: "openai:gpt-6-luna",
````

**High — Interrupt-based HITL**

`/deepagents/generative-ui/your-components/interrupt-based` · route `/generative-ui/your-components/interrupt-based` · under “Call `interrupt` in your Deep Agents agent” · in a `python` block

5 code lines changed.

````diff
+ from langchain_openai import ChatOpenAI
- model="openai:gpt-4o",
+ model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
- model: "openai:gpt-4o",
+ model: "openai:gpt-6-luna",
````

**High — Intelligence · Quickstart**

`/deepagents/intelligence/quickstart` · route `/intelligence/quickstart` · under “Connect Intelligence in 5 minutes”

52 code lines, 5 headings, 99 prose lines changed. The number of fenced code blocks changed.

````diff
- You want to persist conversations reliably in production, improve your agents over time, understand their performance with AI analytics, and inspect every thread, event, and state change.
- CopilotKit Intelligence adds these capabilities to your existing app without changing your frontend or agent framework.
- You are done when Inspector shows that Intelligence is connected and displays your first saved thread. React Native apps confirm the thread in the hosted Intelligence project because React Native does not include Inspector.
+ ## Overview
+ You want AG-UI Streams, User Memory, Automatic Learning, Channels, and Product Analytics on the app you already have. Intelligence adds that layer. Your frontend and your agent stay where they are.
+ 
+ Keep your existing thread storage and native persistence configured. Intelligence automatically records its own copy of supported AG-UI interaction history as conversations run through the connected runtime. See [what Intelligence records](/deepagents/intelligence/bring-your-own-thread-system#how-recording-works) and the [existing LangGraph app example](/deepagents/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation).
+ 
````

**High — Threads Drawer**

`/deepagents/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “When should I use this?”

32 code lines, 4 headings, 51 prose lines changed. The number of fenced code blocks changed.

````diff
- server-side). <SignupLink surface="docs_drawer">Get a free developer account</SignupLink> to set that up.
+ server-side). <SignupLink surface="docs_drawer">Start cloud-hosted setup</SignupLink> to create or select a project.
- [scope Rich Threads to the signed-in user](/deepagents/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
+ [scope AG-UI Streams to the signed-in user](/deepagents/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
- body="Get persistent threads and realtime sync on the free Developer tier."
+ body="Connect a cloud-hosted project to get persistent threads and realtime sync."
+ <Callout type="warn">
+ **The Drawer ships only in `@copilotkit/react-core/v2`.** There is no v1
````

**High — Quickstart**

`/deepagents/quickstart` · route `/quickstart` · under “Create a free account”

25 code lines, 2 headings, 15 prose lines changed. The number of fenced code blocks changed.

````diff
- ### Create a free account
+ ### Set up CopilotKit Intelligence
- <SignupLink surface="docs_deepagents_quickstart_step1">Sign up for a free developer account</SignupLink> for CopilotKit Intelligence to get a license key. You'll use it later to enable persistent threads and the inspector.
+ <SignupLink surface="docs_deepagents_quickstart_step1">Sign in to cloud-hosted Intelligence</SignupLink>. Cloud-hosted setup uses a server-side project API key and does not issue `COPILOTKIT_LICENSE_TOKEN`. You will connect the app after you create it below.
- model="openai:gpt-4o",
+ model="openai:gpt-6-luna",
- model: "openai:gpt-4o",
+ model: "openai:gpt-6-luna",
````

**High — Writing agent state**

`/deepagents/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Re-run the agent with updated state”

5 code lines, 2 prose lines changed.

````diff
- If you want to re-run it manually, use `agent.runAgent` after updating state.
+ If you want to re-run it manually, call `copilotkit.runAgent({ agent })` after updating state. Running through `copilotkit` sends your frontend tools and context with the run and executes any frontend tool calls.
- import { useAgent } from "@copilotkit/react-core/v2"; // [!code highlight]
+ import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2"; // [!code highlight]
+ const { copilotkit } = useCopilotKit(); // [!code highlight]
- agent.runAgent();
+ copilotkit.runAgent({ agent });
````

**High — Predictive State Updates**

`/deepagents/shared-state/predictive-state-updates` · route `/shared-state/predictive-state-updates` · under “Emit the intermediate state” · in a `ts` block

13 code lines changed.

````diff
- const model = new ChatOpenAI({ model: "gpt-4o-mini" });
+ const model = new ChatOpenAI({ modelKwargs: { reasoning_effort: "none" }, model: "gpt-6-luna" });
- model = ChatOpenAI(model="gpt-5.4")
+ model = ChatOpenAI(model="gpt-6-luna", reasoning_effort="none")
- model: "gpt-5.4",
- modelKwargs: { parallel_tool_calls: false },
+ model: "gpt-6-luna",
+ modelKwargs: { parallel_tool_calls: false, reasoning_effort: "none" },
````

**Medium — Thread & History Lifecycle**

`/deepagents/threads-lifecycle` · route `/threads-lifecycle` · under “The lifecycle at a glance”

3 headings, 17 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/deepagents/intelligence/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [AG-UI Streams & Framework Threads](/deepagents/intelligence/threads-explained) for the full server-side model.
- ## Scope Rich Threads to the signed-in user
+ <span id="scope-rich-threads-to-the-signed-in-user" />
+ ## Scope AG-UI Streams to the signed-in user
+ 
- [Connect your runtime to Intelligence](/deepagents/intelligence/connect-your-runtime) covers the
+ [Connect your runtime to Intelligence](/deepagents/intelligence/quickstart) covers the
````

**Low — Headless Threads**

`/deepagents/headless-threads` · route `/headless-threads` · under “Headless Threads”

28 prose lines changed.

````diff
+ Intelligence’s AG-UI streams power the history and delivery behind this custom UI. Use `useThreads` to list and manage conversations, and pass their `threadId` to your chat.
+ 
- CopilotKit Rich Threads enable persistent, resumable multi-turn conversations. The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
+ The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
- [scope Rich Threads to the signed-in user](/deepagents/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
+ [scope AG-UI Streams to the signed-in user](/deepagents/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
- <Callout type="info" title="Migrating existing history?">
- Threads capture new CopilotKit conversations once your app is connected to
````

---

## 2026-09-18

### 07:18 UTC — 6 pages, highest severity high

**High — Intelligence · Quickstart**

`/deepagents/intelligence/quickstart` · route `/intelligence/quickstart` · under “Copy this prompt into your coding agent” · in a `text` block

8 code lines changed.

````diff
- Read https://docs.copilotkit.ai/backend/runtime-endpoints#enable-rich-threads-routes and finish setting up Rich Threads in this repository.
- 
- First inspect the repository's agent instructions, installed CopilotKit versions, Runtime adapter, frontend provider, route or proxy setup, and existing authentication. Preserve the current framework and deployment model. Preserve existing authentication middleware and access checks on every Runtime route.
+ Help me set this up in my CopilotKit app. Run this command and follow the instructions:
- Follow the guide to enable the multi-route Runtime, align the frontend transport, and expose the full Runtime subtree for GET, POST, PATCH, and DELETE. Authenticate every Runtime route with onRequest. Set identifyUser from the existing server-verified signed-in application user. Enforce thread ownership for threads/events, threads/state, and agent/stop as described in https://docs.copilotkit.ai/auth#thread-authorization. Never use a fixed demo identity in production. If no trusted user identity or ownership source exists, stop and ask me which source to use.
+ npx --yes copilotkit@latest onboard start --intent add-rich-threads
- Start the app. For a browser frontend, open Inspector and verify that Home shows Intelligence connected. Send one message, open Threads in Inspector, and confirm that the new thread contains the message. React Native does not include Inspector, so verify its new thread in the selected hosted Intelligence project instead. Run focused tests, lint, and typecheck. Report the files changed, commands run, and verification result. If blocked, explain the missing input; do not invent setup.
+ If it requires a CopilotKit CLI session check, you have permission to run it. Never reveal credentials.
````

**High — Quickstart**

`/deepagents/quickstart` · route `/quickstart` · under “Quickstart”

23 code lines, 1 heading, 12 prose lines changed. The number of fenced code blocks changed.

````diff
- <IntelligenceOnboardingPrompt
- feature="learning"
- surface="docs_deepagents_quickstart"
- />
+ ## Start with your coding agent
+ Use this prompt to connect your Deep Agents agent to CopilotKit and verify a working conversation. Your coding agent will follow this guide in your project, or you can work through the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
````

**Medium — WebMCP**

`/deepagents/webmcp` · route `/webmcp` · under “Setup with a coding agent”

2 headings changed.

````diff
- ## Setup with a coding agent
+ ## Start with your coding agent
````

**Info — Headless Threads**

`/deepagents/headless-threads` · route `/headless-threads`

Now tracked for the first time.

**Info — Threads Drawer**

`/deepagents/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer`

Now tracked for the first time.

**Info — Thread & History Lifecycle**

`/deepagents/threads-lifecycle` · route `/threads-lifecycle`

Now tracked for the first time.

---

---

## 2026-09-04

### 08:09 UTC — 1 page, highest severity high

**High — Quickstart**

`/deepagents/quickstart` · route `/quickstart` · under “Setup Copilot Runtime” · in a `tsx` block

6 code lines, 4 prose lines changed.

````diff
- apiKey: process.env.INTELLIGENCE_API_KEY!,
+ apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
- apiKey: process.env.INTELLIGENCE_API_KEY!,
+ apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
- The runtime reads the license key from step 1. Add it to the app that serves
+ The runtime reads the project API key from step 1. Add it to the app that serves
- INTELLIGENCE_API_KEY=your_license_key
+ CPK_INTELLIGENCE_API_KEY=cpk-...
````

---

---
