import MotionCard from "../motion/MotionCard";
import Morph from "../motion/Morph";
import { morphName } from "../../lib/motion";

export type CourseCardData = { slug: string; title: string; description: string; duration?: string; mode?: string };

export default function CourseCard({ course: t }: { course: CourseCardData }) {
  return (
    <MotionCard
      href={`/training/${t.slug}`}
      className="h-full bg-card border border-line rounded-2xl p-6 flex flex-col gap-3"
    >
      <Morph name={morphName.courseTitle(t.slug)}>
        <h2 className="text-xl font-semibold text-ink self-start">{t.title}</h2>
      </Morph>
      <p className="text-sm text-muted leading-relaxed">{t.description}</p>
      <div className="flex gap-4 text-xs text-muted font-mono">
        {t.duration && <span>{t.duration}</span>}
        {t.mode && <span>{t.mode}</span>}
      </div>
    </MotionCard>
  );
}
