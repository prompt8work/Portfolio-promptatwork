"use client";

import CopyButton from "../motion/CopyButton";

export default function CopyPromptButton({ text }: { text: string }) {
  return (
    <CopyButton
      text={text}
      label="Copy Prompt"
      className="paw-btn paw-btn--primary paw-btn--sm self-start"
    />
  );
}
