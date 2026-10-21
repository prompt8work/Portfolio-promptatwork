import Tag, { type TagTone } from "../paw/Tag";
import { experimentStatus, experimentStatuses, type ExperimentStatus } from "../../lib/content-types";

// Warm marks the live state, as elsewhere on the site (paw/Tag.tsx).
const tone: Record<ExperimentStatus, TagTone> = { designed: "neutral", running: "warm", completed: "blue" };

/** Whether an experiment has been run, so a designed protocol never reads as a result. */
export default function ExperimentStatusTag({ status }: { status?: ExperimentStatus | null }) {
  const value = experimentStatus({ status });
  const label = experimentStatuses.find((s) => s.value === value)!.badge;
  return <Tag tone={tone[value]}>{label.toUpperCase()}</Tag>;
}
