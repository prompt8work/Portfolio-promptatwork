import MotionCard from "../motion/MotionCard";
import Morph from "../motion/Morph";
import { morphName } from "../../lib/motion";

export type CourseCardData = { slug: string; title: string; description: string; duration?: string; mode?: string };

export default function CourseCard({ course: t }: { course: CourseCardData }) {
  return (
    <MotionCard
      href={`/training/${t.slug}`}
      className="h-full bg-neutral-0 border border-neutral-200 rounded-2xl p-6 flex flex-col gap-3"
    >
      <Morph name={morphName.courseTitle(t.slug)}>
        <h2 className="font-display text-xl font-semibold text-neutral-900 self-start">{t.title}</h2>
      </Morph>
      <p className="text-sm text-neutral-600 leading-relaxed">{t.description}</p>
      <div className="flex gap-4 text-xs text-neutral-600 font-mono">
        {t.duration && <span>{t.duration}</span>}
        {t.mode && <span>{t.mode}</span>}
      </div>
    </MotionCard>
  );
}
