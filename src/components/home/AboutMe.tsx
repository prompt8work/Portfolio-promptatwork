import Link from "next/link";
import Reveal from "../motion/Reveal";
import { aboutMe } from "../../../data/aboutMe";

/** Homepage "About me" — personal introduction, no photo, no work summary (that's the AI Lab's job). */
export default function AboutMe() {
  return (
    <section id="about" className="w-full scroll-mt-20 border-t border-neutral-200">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 py-20 sm:py-24 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16">
        <Reveal className="flex flex-col gap-3">
          <span className="font-mono text-xs tracking-[0.14em] font-semibold text-plum-600">ABOUT ME</span>
          <h2 className="font-display text-[32px] sm:text-[40px] leading-[1.1] font-semibold text-neutral-900">
            {aboutMe.heading}
          </h2>
        </Reveal>
        <Reveal className="flex flex-col gap-5">
          {aboutMe.paragraphs.map((p) => (
            <p key={p} className="text-[17px] leading-[1.75] text-neutral-700">
              {p}
            </p>
          ))}
          <div className="flex gap-6 flex-wrap pt-1 text-[14.5px] font-semibold">
            <Link href="/portfolio" className="text-neutral-900 hover:text-plum-600">
              See my portfolio →
            </Link>
            <Link href="/contact" className="text-neutral-900 hover:text-plum-600">
              Say hello →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
