import type { Metadata } from "next";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import SectionHeading from "../../components/ui/SectionHeading";
import Reveal from "../../components/motion/Reveal";
import MotionCard from "../../components/motion/MotionCard";
import { StaggerGrid, StaggerItem } from "../../components/motion/StaggerGrid";
import TestimonialForm from "../../components/testimonials/TestimonialForm";
import { getPublishedTestimonials } from "../../supabase/testimonialRepository";
import { buildMetadata } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Testimonials — Niharika Dhande, AI Trainer & AI Solutions Engineer | PromptAtWork",
  description: "What it's been like working with Niharika Dhande — and a place to add your own.",
  path: "/testimonials",
});

export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <PageTransition className="min-h-screen bg-neutral-50">
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[1100px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-10">
            <SectionHeading
              level="page"
              eyebrow="TESTIMONIALS"
              title="What it's been like to work together"
              description="Real feedback from clients, colleagues and training participants — and a place to add your own."
              align="start"
            />
          </div>
        </section>

        {testimonials.length > 0 && (
          <section className="w-full">
            <StaggerGrid className="max-w-[1100px] mx-auto px-5 sm:px-10 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <StaggerItem key={t.id}>
                  <MotionCard className="h-full bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col gap-4">
                    <p className="font-display text-lg italic text-neutral-900 leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <span className="w-10 h-10 rounded-full bg-plum-100 flex items-center justify-center font-mono text-xs text-plum-700 shrink-0">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                        {(t.role || t.organization) && (
                          <div className="text-xs text-neutral-600">
                            {[t.role, t.organization].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </MotionCard>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>
        )}

        <section className="w-full bg-neutral-100">
          <div className="max-w-[700px] mx-auto px-5 sm:px-10 py-16 sm:py-20">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">Share your experience</h2>
              <p className="text-sm text-neutral-600 mb-8">
                Worked together on a project, training or consulting engagement? A couple of sentences helps a lot.
              </p>
            </Reveal>
            <Reveal index={1}>
              <TestimonialForm />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </PageTransition>
  );
}
