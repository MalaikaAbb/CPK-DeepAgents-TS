"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * CopilotSidebar — prebuilt component page.
 *
 * The rendered Deep Agents page publishes only the import line
 * (`import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2"` plus the
 * v2 stylesheet); its usage example is a missing
 * `deepagents::...` snippet. NOT FROM THE DOC PAGE: the mount below is the
 * minimal one, `<CopilotSidebar agentId="sample_agent" />`, using only `agentId` from the
 * page's props table so the component can be exercised. `CopilotKit` and the
 * stylesheet come from the app root.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/prebuilt-components/sidebar" subtitle="agent: sample_agent · CopilotSidebar">
      <div className="relative h-full">
        <main className="flex h-full items-center justify-center p-8 text-center text-sm text-slate-500">
          Main content area. Open the sidebar with the launcher button.
        </main>
        <CopilotSidebar agentId="sample_agent" />
      </div>
    </DemoFrame>
  );
}
