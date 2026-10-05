import Button from "../ui/Button";
import Reveal from "../motion/Reveal";

/** Homepage pointer into the two portfolio profiles (/portfolio) — the detail lives there, not here. */
export default function PortfolioCTA() {
  return (
    <section id="portfolio" className="w-full bg-neutral-100 border-y border-neutral-200">
      <Reveal className="max-w-[1280px] mx-auto px-5 sm:px-10 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-[560px] text-center sm:text-left">
          <h2 className="font-display text-[28px] font-semibold text-neutral-900">Want the full picture?</h2>
          <p className="text-[14.5px] text-neutral-600 leading-relaxed">
            See how I build AI solutions for engineering teams, and how I train teams to use AI on their own work.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button href="/portfolio/ai-solutions-engineer">AI Solutions Engineer</Button>
          <Button href="/portfolio/ai-enablement-officer" variant="secondary">
            AI Training &amp; Enablement
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
