import { getCanonicalUrl, siteUrl } from "./site";
import type { SiteSettings } from "./content";

// Structured data (JSON-LD) and search keywords, built from Site settings in
// Sanity. Every phrase there should be backed by a fact already on the
// site — search engines and AI assistants repeat what this says.

export const personId = `${siteUrl}/#person`;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

/** The sitewide keyword list: the base keywords plus "<tool> training" / "<tool> expert in <city>". */
export function siteKeywords(s: SiteSettings): string[] {
  const city = s.address?.city;
  return [...(s.keywords ?? []), ...(s.toolKeywords ?? []).flatMap((tool) => [`${tool} training`, `${tool} expert in ${city}`])];
}

/** Every tool named in the AI tools groups, in order. */
export const aiToolNames = (s: SiteSettings) => (s.aiTools ?? []).flatMap((group) => group.tools);

export function personRef(s: SiteSettings) {
  return { "@type": "Person", "@id": personId, name: s.personName, url: getCanonicalUrl("/") };
}

const profileUrls = (s: SiteSettings) => [`https://${s.linkedin}`, `https://${s.github}`];

function place(s: SiteSettings) {
  const a = s.address;
  return {
    address: { "@type": "PostalAddress", addressLocality: a.city, addressRegion: a.region, addressCountry: a.countryCode },
    city: {
      "@type": "City",
      name: a.city,
      containedInPlace: { "@type": "State", name: a.region, containedInPlace: { "@type": "Country", name: a.countryName } },
    },
  };
}

// One linked @graph for the homepage: who the person is, what the business
// offers and where, and the website itself.
export function buildHomeJsonLd(s: SiteSettings) {
  const { address, city } = place(s);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: s.personName,
        alternateName: s.personAlternateNames,
        jobTitle: [s.jobTitle, ...(s.jobTitles ?? [])],
        description: s.personDescription,
        url: getCanonicalUrl("/"),
        image: getCanonicalUrl("/images/Hero_image.png"),
        email: `mailto:${s.email}`,
        address,
        homeLocation: city,
        knowsAbout: [...(s.personKnowsAbout ?? []), ...aiToolNames(s)],
        hasOccupation: (s.occupations ?? []).map((name) => ({ "@type": "Occupation", name, occupationLocation: city })),
        worksFor: { "@id": organizationId },
        sameAs: profileUrls(s),
      },
      {
        "@type": "ProfessionalService",
        "@id": organizationId,
        name: s.brandName,
        alternateName: s.brandAlternateNames,
        url: getCanonicalUrl("/"),
        description: s.organizationDescription,
        image: getCanonicalUrl("/images/Hero_image.png"),
        founder: { "@id": personId },
        address,
        areaServed: [city, { "@type": "Country", name: s.address.countryName }],
        knowsAbout: s.organizationKnowsAbout,
        makesOffer: [
          ...(s.services ?? []).map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
          ...(s.aiTools ?? []).map((group) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: `${group.category} — training & consulting`,
              description: `Hands-on training, setup and consulting for ${group.tools.join(", ")}.`,
            },
          })),
        ],
        sameAs: profileUrls(s),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: s.brandName,
        alternateName: [...(s.brandAlternateNames ?? []), `${s.brandName} — ${s.personName}`],
        url: getCanonicalUrl("/"),
        inLanguage: "en-IN",
        publisher: { "@id": personId },
      },
    ],
  };
}

// FAQPage for any page that shows question-and-answer pairs on screen.
// Answer engines (ChatGPT, Perplexity, Gemini) quote these directly, so
// only pass questions the page visibly renders.
export function buildFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
