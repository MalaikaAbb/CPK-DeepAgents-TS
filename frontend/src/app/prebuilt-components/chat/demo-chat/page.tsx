"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * CopilotChat — prebuilt component page.
 *
 * The rendered Deep Agents page publishes only the import line
 * (`import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2"` plus the
 * v2 stylesheet); its usage example is a missing
 * `deepagents::...` snippet. NOT FROM THE DOC PAGE: the mount below is the
 * minimal one, `<CopilotChat agentId="sample_agent" />`, using only `agentId` from the
 * page's props table so the component can be exercised. `CopilotKit` and the
 * stylesheet come from the app root.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/prebuilt-components/chat" subtitle="agent: sample_agent · CopilotChat">
      <div className="relative h-full">
        <div className="h-full">
          <CopilotChat agentId="sample_agent" />
        </div>
      </div>
    </DemoFrame>
  );
}
