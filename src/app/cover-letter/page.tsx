import type { Metadata } from "next";
import CoverLetterContent from "../../components/CoverLetterContent";
import { buildMetadata } from "../../lib/site";
import { getCoverLetter, getSiteSettings } from "../../lib/content";

// Server component: the letter is the "Cover letter" document and the
// contact details are Site settings. The interactive part (the print
// button) lives in CoverLetterContent, a Client Component.
export async function generateMetadata(): Promise<Metadata> {
  const letter = await getCoverLetter();
  return buildMetadata({ title: letter.pageTitle, description: letter.seoDescription, path: "/cover-letter" });
}

export default async function CoverLetterPage() {
  const [coverLetter, s] = await Promise.all([getCoverLetter(), getSiteSettings()]);
  return (
    <CoverLetterContent
      coverLetter={coverLetter}
      person={{ personNameCaps: s.personNameCaps, personName: s.personName, email: s.email, linkedin: s.linkedin, location: s.location }}
    />
  );
}
