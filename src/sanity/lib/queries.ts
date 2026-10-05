import { groq } from "next-sanity";

// Shared projection for mixed-type relatedContent arrays (project | tool |
// prompt | experiment | automation) — `_type` lets the rendering component
// pick the right href/label per item without a second query. Declared
// first since several queries below reference it.
const relatedContentProjection = groq`
  relatedContent[]->{ _type, "slug": slug.current, title, name, category }
`;

// Every blog post and AI Lab entry carries process diagrams (content rule —
// Docs/design/content-guidelines.md). Rendered by components/diagrams.
const diagramsProjection = groq`
  "diagrams": diagrams[]{
    "key": key.current, title, kind, placement, caption,
    steps[]{ label, detail, kind, metric, before, after, edgeLabel },
    loopBackTo, loopLabel,
    concept, analogy, pairs[]{ concept, analogy },
    mermaid
  }
`;

// `visibility != "private"` is enforced in the query itself, not just in
// application code — the same defense-in-depth principle as
// the original static `getProjectBySlug` (PRD §22): a private project
// should never even leave the dataset in a public-facing fetch, not just
// be hidden by the page that receives it.

export const projectsQuery = groq`
  *[_type == "project" && visibility != "private"] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    category,
    visibility,
    confidentialityNote,
    summary,
    stats,
    tech,
    aiModels,
    "coverImage": coverImage.asset->url
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && visibility != "private" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    category,
    visibility,
    confidentialityNote,
    summary,
    stats,
    tech,
    aiModels,
    overview,
    problem,
    context,
    solution,
    role,
    architecture,
    workflow,
    challenges,
    results,
    learnings,
    futureScope,
    "coverImage": coverImage.asset->url,
    ${diagramsProjection},
    ${relatedContentProjection}
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && visibility != "private"].slug.current
`;

// Portfolio pages (/portfolio, /portfolio/[slug]) — see portfolioProfile.ts.
// Images are resolved to their CDN url + dimensions for next/image.
const portfolioImage = `{ alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

export const portfolioProfilesQuery = groq`
  *[_type == "portfolioProfile" && defined(slug.current)] | order(order asc) {
    title, "slug": slug.current, summary, heroEyebrow, "heroImage": heroImage ${portfolioImage}
  }
`;

export const portfolioSlugsQuery = groq`
  *[_type == "portfolioProfile" && defined(slug.current)].slug.current
`;

export const portfolioProfileBySlugQuery = groq`
  *[_type == "portfolioProfile" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    "heroImage": heroImage ${portfolioImage},
    "heroLogos": heroLogos[] ${portfolioImage},
    institutes { ..., "items": items[] { ..., "logo": logo ${portfolioImage} } }
  }
`;

// AI Lab case studies shown on a portfolio profile's projects section, newest
// first, so publishing a project in AI Lab adds it to the portfolio too.
// Same visibility filter as projectsQuery.
export const portfolioAiLabProjectsQuery = groq`
  *[_type == "project" && visibility != "private"] | order(publishedAt desc) {
    "slug": slug.current, title, category, summary, stats, tech
  }
`;

// Singleton by convention (_id "portfolio-settings") — [0] takes the only one.
export const portfolioSettingsQuery = groq`
  *[_type == "portfolioSettings"][0] {
    landingEyebrow, landingTitle, landingIntro,
    servicesEyebrow, servicesTitle, servicesIntro,
    "services": services[] { title, description, anchor, linkLabel, "profileSlug": profile->slug.current },
    "earlierRoles": coalesce(earlierRoles, []),
    "credentials": coalesce(credentials, [])
  }
`;

// "!defined(researchStatus) || researchStatus == 'Published'" keeps the 4
// already-seeded tools (created before this field existed) visible without
// a data migration — PRD 04.1 §19 says the public site should normally
// show only Published, but that can't retroactively hide content that
// predates the field.
const publishedToolFilter = `_type == "tool" && (!defined(researchStatus) || researchStatus == "Published")`;

export const toolsQuery = groq`
  *[${publishedToolFilter}] | order(name asc) {
    "slug": slug.current,
    name,
    type,
    category,
    tags,
    description,
    officialUrl,
    pricing,
    "logo": logo.asset->url,
    "hasResearch": defined(researchContent),
    "videoCount": count(relatedVideos),
    "resourceCount": count(resources)
  }
`;

export const toolBySlugQuery = groq`
  *[${publishedToolFilter} && slug.current == $slug][0] {
    "slug": slug.current,
    name,
    type,
    category,
    tags,
    description,
    officialUrl,
    pricing,
    overview,
    whatItDoes,
    whyExplored,
    researchContent,
    useCases,
    practicalScenarios,
    strengths,
    limitations,
    myExperience,
    researchStatus,
    lastUpdated,
    reviewedVersion,
    lastReviewed,
    sources,
    "logo": logo.asset->url,
    "relatedVideos": relatedVideos[]->{ "slug": slug.current, title, thumbnailUrl, externalUrl },
    "resources": resources[]{ title, resourceType, description, version, publishedAt, updatedAt, "fileUrl": file.asset->url, "fileName": file.asset->originalFilename },
    ${diagramsProjection},
    ${relatedContentProjection},
    "relatedExperiments": *[_type == "experiment" && references(^._id)]{ "slug": slug.current, title, objective },
    "relatedBlogs": *[_type == "blog" && references(^._id) && publishedAt <= now()]{ "slug": slug.current, title, excerpt },
    "relatedProjects": *[_type == "project" && visibility != "private" && references(^._id)]{ "slug": slug.current, title, summary }
  }
`;

export const toolSlugsQuery = groq`*[${publishedToolFilter}].slug.current`;

export const promptsQuery = groq`
  *[_type == "prompt"] | order(category asc, title asc) {
    "slug": slug.current,
    title,
    category,
    purpose,
    "toolName": tool->name
  }
`;

export const promptBySlugQuery = groq`
  *[_type == "prompt" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    category,
    purpose,
    prompt,
    variables,
    exampleInput,
    exampleOutput,
    expectedBehavior,
    "failureModes": coalesce(failureModes, []),
    difficulty,
    tips,
    "tool": tool->{ "slug": slug.current, name },
    ${diagramsProjection},
    ${relatedContentProjection}
  }
`;

export const promptSlugsQuery = groq`*[_type == "prompt"].slug.current`;

export const experimentsQuery = groq`
  *[_type == "experiment"] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    objective,
    "toolName": tool->name
  }
`;

export const experimentBySlugQuery = groq`
  *[_type == "experiment" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    objective,
    hypothesis,
    problem,
    setup,
    promptOrWorkflow,
    input,
    output,
    whatWorked,
    whatFailed,
    learning,
    decision,
    nextStep,
    useCases,
    "tool": tool->{ "slug": slug.current, name },
    ${diagramsProjection},
    ${relatedContentProjection}
  }
`;

export const experimentSlugsQuery = groq`*[_type == "experiment"].slug.current`;

export const automationsQuery = groq`
  *[_type == "automation"] | order(title asc) {
    "slug": slug.current,
    title,
    description,
    trigger
  }
`;

export const automationBySlugQuery = groq`
  *[_type == "automation" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    category,
    description,
    problem,
    trigger,
    steps,
    architecture,
    input,
    output,
    "integrations": coalesce(integrations, []),
    limitations,
    securityNotes,
    learnings,
    "tools": tools[]->{ "slug": slug.current, name },
    ${diagramsProjection},
    ${relatedContentProjection}
  }
`;

export const automationSlugsQuery = groq`*[_type == "automation"].slug.current`;

export const blogPostsQuery = groq`
  *[_type == "blog" && publishedAt <= now()] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    excerpt,
    category,
    tags,
    author,
    readingTime,
    publishedAt,
    "coverImage": coverImage.asset->url
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blog" && slug.current == $slug && publishedAt <= now()][0] {
    "slug": slug.current,
    title,
    excerpt,
    body,
    category,
    tags,
    author,
    readingTime,
    publishedAt,
    seoTitle,
    seoDescription,
    "coverImage": coverImage.asset->url,
    ${diagramsProjection},
    ${relatedContentProjection}
  }
`;

export const blogSlugsQuery = groq`*[_type == "blog" && publishedAt <= now()].slug.current`;

export const videosQuery = groq`
  *[_type == "video"] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    thumbnailUrl,
    description,
    publishedAt,
    playlist,
    externalUrl,
    externalId
  }
`;

export const trainingsQuery = groq`
  *[_type == "training" && registrationEnabled == true] | order(title asc) {
    "slug": slug.current,
    title,
    description,
    duration,
    mode,
    audience
  }
`;

export const trainingBySlugQuery = groq`
  *[_type == "training" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    description,
    learningOutcomes,
    topics,
    audience,
    duration,
    mode,
    instructor,
    registrationEnabled,
    testimonials,
    ${relatedContentProjection}
  }
`;

export const trainingSlugsQuery = groq`*[_type == "training" && registrationEnabled == true].slug.current`;

// Real last-edited dates for the sitemap's <lastmod>. Which URLs exist is
// still decided by the *SlugsQuery queries above; this only supplies dates.
export const sitemapUpdatedAtQuery = groq`
  *[_type in ["project", "tool", "prompt", "experiment", "automation", "blog", "training", "portfolioProfile", "engineeringArea"] && defined(slug.current) && !(_id in path("drafts.**"))] {
    _type, "slug": slug.current, _updatedAt
  }
`;

// AI Lab → Engineering. Each area's evidence is every published entry that
// tags it (engineeringAreas), with the same visibility filters as the
// per-type queries — so publishing a tagged entry updates the page.
const engineeringEvidenceFilter = `references(^._id) && (
  (_type == "project" && visibility != "private") ||
  _type in ["automation", "prompt", "experiment"] ||
  (${publishedToolFilter})
)`;

export const engineeringAreasQuery = groq`
  *[_type == "engineeringArea"] | order(order asc) {
    "id": slug.current, title, description, items,
    "evidence": *[${engineeringEvidenceFilter}] | order(title asc, name asc) {
      _type, "slug": slug.current, "title": coalesce(title, name)
    }
  }
`;

// One round-trip for the AI Lab hub's sidebar, ⌘K search index and
// previous/next links (src/app/ai-lab/layout.tsx). Same visibility filters
// as the per-type list queries above.
// AI Lab overview: every case study with the pages that document its parts,
// plus how many entries each section has so empty sections can be left out.
export const aiLabOverviewQuery = groq`{
  "projects": *[_type == "project" && visibility != "private"] | order(publishedAt desc) {
    "slug": slug.current, title, category, summary,
    "parts": parts[]->{ _type, "slug": slug.current, "title": coalesce(title, name) }
  },
  "counts": {
    "tools": count(*[${publishedToolFilter}]),
    "experiments": count(*[_type == "experiment"]),
    "prompts": count(*[_type == "prompt"]),
    "automations": count(*[_type == "automation"])
  }
}`;

export const aiLabNavQuery = groq`{
  "projects": *[_type == "project" && visibility != "private"] | order(publishedAt desc) {
    "slug": slug.current, title, "summary": summary,
    "parts": parts[]->{ _type, "slug": slug.current, "title": coalesce(title, name) }
  },
  "tools": *[${publishedToolFilter}] | order(name asc) {
    "slug": slug.current, "title": name, "summary": description
  },
  "experiments": *[_type == "experiment"] | order(publishedAt desc) {
    "slug": slug.current, title, "summary": objective
  },
  "prompts": *[_type == "prompt"] | order(category asc, title asc) {
    "slug": slug.current, title, "summary": purpose
  },
  "automations": *[_type == "automation"] | order(title asc) {
    "slug": slug.current, title, "summary": description
  },
  "engineering": *[_type == "engineeringArea" && count(*[${engineeringEvidenceFilter}]) > 0] | order(order asc) {
    "id": slug.current, title, "summary": description
  }
}`;
