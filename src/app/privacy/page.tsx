import type { Metadata } from "next";
import Nav from "../../components/Nav";
import PageTransition from "../../components/PageTransition";
import SiteFooter from "../../components/SiteFooter";
import { personalInfo } from "../../../data";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/motion/Reveal";
import { buildMetadata } from "../../lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — PromptAtWork",
  description: "What PromptAtWork collects through its public forms, why, and how it's stored.",
  path: "/privacy",
});

const heading = "text-xl font-semibold text-ink mt-10 mb-3";
const body = "text-[15px] leading-relaxed text-on-surface-variant";

export default function PrivacyPage() {
  return (
    <PageTransition className="min-h-screen">
      <Nav />
      <main>
        <section className="w-full">
          <div className="max-w-[760px] mx-auto px-5 sm:px-10 pt-16 sm:pt-20 pb-24">
            <PageHeader
              eyebrow="PRIVACY"
              title="Privacy Policy"
              description="This page describes, plainly, what PromptAtWork actually collects when you use one of its public forms, why, and where it's stored. It covers this website only."
            />

            <Reveal>
              <h2 className={heading}>What&apos;s collected, and why</h2>
              <p className={body}>
                <strong className="text-ink">Contact form</strong> — your name, email, organization (optional),
                purpose of contact, and your message. Used only to respond to you.
              </p>
              <p className={body}>
                <strong className="text-ink">Training registration</strong> — your name, email, phone
                (optional), organization (optional), and experience level. Used only to manage your registration for
                that training batch.
              </p>
              <p className={body}>
                <strong className="text-ink">Blog comments</strong> — your name, email, and comment text. Held
                for review before it becomes visible to other visitors — nothing you submit here is shown publicly until
                approved.
              </p>
              <p className={body}>
                <strong className="text-ink">Blog reactions</strong> — no personal information at all. A
                reaction is tied to an anonymized identifier generated in your browser, used only to prevent the same
                visitor from reacting to the same post twice.
              </p>
            </Reveal>
            <Reveal>
              <h2 className={heading}>Where it&apos;s stored</h2>
              <p className={body}>
                Everything above is stored in a Postgres database (Supabase), in the same region the site itself runs
                from. Submissions are never sold, shared with third parties, or used for anything beyond the specific
                purpose listed above.
              </p>
            </Reveal>
            <Reveal>
              <h2 className={heading}>What this site doesn&apos;t do</h2>
              <p className={body}>
                No third-party advertising trackers, no data brokers, no marketing email lists built from form
                submissions. If that changes, this page will be updated to say so — plainly, the same way it&apos;s
                written now.
              </p>
            </Reveal>
            <Reveal>
              <h2 className={heading}>Questions</h2>
              <p className={body}>
                Reach out through the{" "}
                <a href="/contact" className="text-primary hover:text-primary underline">
                  contact form
                </a>{" "}
                or email{" "}
                <a href={`mailto:${personalInfo.email}`} className="text-primary hover:text-primary underline">
                  {personalInfo.email}
                </a>
                .
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
