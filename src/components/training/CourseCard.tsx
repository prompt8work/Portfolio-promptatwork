import MotionCard from "../motion/MotionCard";
import Morph from "../motion/Morph";
import { morphName } from "../../lib/motion";
import Thumb from "../paw/Thumb";

export type CourseCardData = { slug: string; title: string; description: string; duration?: string; mode?: string; cardImage?: string };

export default function CourseCard({ course: t }: { course: CourseCardData }) {
  return (
    <MotionCard
      href={`/training/${t.slug}`}
      className="h-full bg-card border border-line rounded-2xl flex flex-col overflow-hidden"
    >
      {t.cardImage ? (
        <>
          <Thumb image={t.cardImage} sizes="(max-width: 640px) 100vw, 50vw" className="rounded-none" />
          <CourseCardBody course={t} />
        </>
      ) : (
        // No image yet: the text sits on the artwork instead of below an empty block.
        <Thumb variant="blue" aspect="auto" className="h-full rounded-none">
          <CourseCardBody course={t} />
        </Thumb>
      )}
    </MotionCard>
  );
}

function CourseCardBody({ course: t }: { course: CourseCardData }) {
  return (
    <div className="p-6 flex flex-col gap-3">
      <Morph name={morphName.courseTitle(t.slug)}>
        <h2 className="text-xl font-semibold text-ink self-start">{t.title}</h2>
      </Morph>
      <p className="text-sm text-muted leading-relaxed">{t.description}</p>
      <div className="flex gap-4 text-xs text-muted font-mono">
        {t.duration && <span>{t.duration}</span>}
        {t.mode && <span>{t.mode}</span>}
      </div>
    </div>
  );
}
