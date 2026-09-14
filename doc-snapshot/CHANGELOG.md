# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-14

### 09:18 UTC — 5 pages, highest severity high

**High — Intelligence · Quickstart**

`/deepagents/intelligence/quickstart` · route `/intelligence/quickstart` · under “Copy this prompt into your coding agent” · in a `text` block

16 code lines, 4 headings, 7 prose lines changed.

````diff
- Read https://docs.copilotkit.ai/backend/runtime-endpoints#enable-rich-threads-routes and finish setting up Rich Threads in this repository.
- 
- First inspect the repository's agent instructions, installed CopilotKit versions, Runtime adapter, frontend provider, route or proxy setup, and existing authentication. Preserve the current framework and deployment model. Preserve existing authentication middleware and access checks on every Runtime route.
+ Help me set this up in my CopilotKit app. Run this command and follow the instructions:
- Follow the guide to enable the multi-route Runtime, align the frontend transport, and expose the full Runtime subtree for GET, POST, PATCH, and DELETE. Authenticate every Runtime route with onRequest. Set identifyUser from the existing server-verified signed-in application user. Enforce thread ownership for threads/events, threads/state, and agent/stop as described in https://docs.copilotkit.ai/auth#thread-authorization. Never use a fixed demo identity in production. If no trusted user identity or ownership source exists, stop and ask me which source to use.
+ npx --yes copilotkit@latest onboard start --intent add-rich-threads
- Start the app. For a browser frontend, open Inspector and verify that Home shows Intelligence connected. Send one message, open Threads in Inspector, and confirm that the new thread contains the message. React Native does not include Inspector, so verify its new thread in the selected hosted Intelligence project instead. Run focused tests, lint, and typecheck. Report the files changed, commands run, and verification result. If blocked, explain the missing input; do not invent setup.
+ If it requires a CopilotKit CLI session check, you have permission to run it. Never reveal credentials or send optional diagnostic feedback reports.
````

**Medium — WebMCP**

`/deepagents/webmcp` · route `/webmcp` · under “Existing React frontend tool”

2 headings, 2 prose lines changed.

````diff
- ### Existing React frontend tool
+ 
+ ### React frontend tool
+ 
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

## 2026-08-26

### 10:26 UTC — 1 page, highest severity high

**High — Quickstart**

`/deepagents/quickstart` · route `/quickstart` · under “Quickstart”

58 code lines, 12 prose lines changed. The number of fenced code blocks changed.

````diff
- body="Add persistent threads and the inspector with the Enterprise Intelligence Platform."
+ body="Add persistent threads and the inspector with CopilotKit Intelligence."
- <SignupLink surface="docs_deepagents_quickstart_step1">Sign up for a free developer account</SignupLink> on our Enterprise Intelligence Platform to get a license key. You'll use it later to enable persistent threads and the inspector.
+ <SignupLink surface="docs_deepagents_quickstart_step1">Sign up for a free developer account</SignupLink> for CopilotKit Intelligence to get a license key. You'll use it later to enable persistent threads and the inspector.
- ```tsx title="app/api/copilotkit/route.ts"
+ ```tsx title="app/api/copilotkit/[[...slug]]/route.ts" doctest="component"
- CopilotRuntime,
- ExperimentalEmptyAdapter,
````

---

---
