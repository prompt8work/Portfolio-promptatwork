import Link from "next/link";
import { getPublishedTestimonials } from "../../supabase/testimonialRepository";
import { StaggerGrid, StaggerItem } from "../motion/StaggerGrid";
import Reveal from "../motion/Reveal";
import { getHomePage } from "../../lib/content";

// Testimonial wall (New-Testimonials board), from the published rows of the
// testimonial table only. It renders nothing until at least one real
// testimonial is approved, and shows as many cards as there are (up to
// three), never the board's bracketed sample cards. No star ratings: the
// table doesn't collect them.
export default async function Testimonial() {
  const [all, home] = await Promise.all([getPublishedTestimonials(), getHomePage()]);
  const testimonials = all.slice(0, 3);
  if (testimonials.length === 0) return null;

  const cols = testimonials.length === 1 ? "max-w-[480px] mx-auto" : testimonials.length === 2 ? "md:grid-cols-2 max-w-[960px] mx-auto" : "md:grid-cols-3";

  return (
    <section
      className="w-full"
      style={{ background: "radial-gradient(50% 70% at 50% 100%, color-mix(in srgb, var(--accent-violet) 14%, transparent), transparent 70%)" }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 lg:py-[72px] flex flex-col gap-10">
        <Reveal className="flex flex-col items-center gap-2 text-center">
          <p className="paw-section-head__eyebrow m-0">{home.testimonialsHeading?.eyebrow}</p>
          <h2 className="m-0 text-[32px] leading-10 sm:text-[40px] sm:leading-[44px] font-semibold tracking-[-0.03em]">
            {home.testimonialsHeading?.title}
          </h2>
        </Reveal>

        <StaggerGrid className={`grid grid-cols-1 gap-6 items-stretch w-full ${cols}`}>
          {testimonials.map((t, i) => {
            const detail = [t.role, t.organization].filter(Boolean).join(", ");
            return (
              <StaggerItem key={t.id} className="h-full">
                <figure
                  className={`m-0 h-full p-7 rounded-2xl paw-glass flex flex-col gap-[18px] ${i === 0 ? "border-[color-mix(in_srgb,var(--accent-violet)_60%,transparent)]" : ""}`}
                >
                  <blockquote className="m-0 text-[17px] leading-[27px] text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-auto pt-[18px] border-t border-line flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-full grid place-items-center font-semibold text-[15px] text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}
                      aria-hidden="true"
                    >
                      {t.name.charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold">{t.name}</span>
                      {detail && <span className="block text-[13px] text-muted">{detail}</span>}
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        <div className="flex justify-center">
          <Link href="/testimonials" className="paw-section-head__link">
            Read more testimonials →
          </Link>
        </div>
      </div>
    </section>
  );
}
