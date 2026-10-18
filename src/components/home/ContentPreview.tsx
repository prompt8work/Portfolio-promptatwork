import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { client } from "../../sanity/lib/client";
import { blogPostsQuery, videosQuery } from "../../sanity/lib/queries";
import { personalInfo } from "../../../data";
import LinkedinIcon from "../icons/LinkedinIcon";
import { StaggerGrid, StaggerItem } from "../motion/StaggerGrid";
import SectionHeader from "../paw/SectionHeader";
import Thumb from "../paw/Thumb";

// Latest writing & videos (New-Blog board): the newest published post and
// the newest synced YouTube video, then a LinkedIn follow row. LinkedIn is a
// distribution channel for the site's own posts, not an imported source
// (PRD 04.2), so that row is static. A card is left out when there's
// nothing published for it, rather than showing placeholder text.
type Post = { slug: string; title: string; excerpt: string; category?: string; tags?: string[]; coverImage?: string };
type Video = { slug: string; title: string; description?: string; thumbnailUrl?: string; externalUrl: string; publishedAt?: string };

export default async function ContentPreview() {
  const [posts, videos] = await Promise.all([client.fetch<Post[]>(blogPostsQuery), client.fetch<Video[]>(videosQuery)]);
  const post = posts[0];
  const video = videos[0];

  return (
    <section id="content" className="w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 lg:py-[72px] flex flex-col gap-8">
        <SectionHeader eyebrow="CONTENT" title="Latest Writing & Videos" link={{ href: "/blog", label: "View all" }} />

        {(post || video) && (
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {post && (
              <StaggerItem>
                <Link href={`/blog/${post.slug}`} className="paw-card h-full p-0 gap-0 overflow-hidden">
                  {/* With a cover: the image, then the text. Without one, the text
                      sits on the artwork instead of an empty block above it. */}
                  <Thumb
                    image={post.coverImage}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    variant="violet"
                    aspect="auto"
                    className={`rounded-none ${post.coverImage ? "h-[240px]" : "h-full"}`}
                  >
                    <div className={`${post.coverImage ? "absolute inset-0" : "relative"} p-6 sm:px-7 flex flex-col gap-4`}>
                      <span className="label-md self-start h-6 px-2.5 rounded-md inline-flex items-center bg-[color-mix(in_srgb,var(--surface-container-lowest)_70%,transparent)] border border-line text-primary">
                        BLOG{post.category ? ` · ${post.category.toUpperCase()}` : ""}
                      </span>
                      {!post.coverImage && <PostText post={post} />}
                      {post.tags && post.tags.length > 0 && (
                        <div className="self-start mt-auto px-4 py-3 rounded-xl bg-[color-mix(in_srgb,var(--surface-container-lowest)_75%,transparent)] border border-line font-mono text-[13px] leading-5 text-[var(--on-surface)]">
                          {post.tags.slice(0, 3).join(" · ")}
                        </div>
                      )}
                    </div>
                  </Thumb>
                  {post.coverImage && (
                    <div className="px-7 pt-6 pb-7">
                      <PostText post={post} />
                    </div>
                  )}
                </Link>
              </StaggerItem>
            )}

            {video && (
              <StaggerItem>
                <a href={video.externalUrl} target="_blank" rel="noopener noreferrer" className="paw-card h-full p-0 gap-0 overflow-hidden">
                  <Thumb variant="warm" aspect="auto" className="h-[240px] rounded-none">
                    {video.thumbnailUrl && (
                      <Image src={video.thumbnailUrl} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-80" />
                    )}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <span className="label-md self-start h-6 px-2.5 rounded-md inline-flex items-center bg-[color-mix(in_srgb,var(--surface-container-lowest)_70%,transparent)] border border-line text-tertiary">
                        YOUTUBE
                      </span>
                      <span className="self-center w-16 h-16 rounded-full grid place-items-center bg-[rgba(248,250,252,0.92)] text-[#0f172a]">
                        <Play className="w-6 h-6 fill-current" aria-hidden="true" />
                      </span>
                      <span />
                    </div>
                  </Thumb>
                  <div className="px-7 pt-6 pb-7 flex flex-col gap-2.5">
                    <h3 className="m-0 text-2xl leading-[30px] font-semibold tracking-[-0.02em]">{video.title}</h3>
                    {video.description && <p className="m-0 text-[15px] leading-6 text-muted line-clamp-2">{video.description}</p>}
                  </div>
                </a>
              </StaggerItem>
            )}
          </StaggerGrid>
        )}

        <a
          href={`https://${personalInfo.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-5 py-4 rounded-xl border border-dashed border-line hover:border-outline transition-colors"
        >
          <span className="w-9 h-9 rounded-lg grid place-items-center text-primary bg-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)] shrink-0">
            <LinkedinIcon className="w-4 h-4" />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">Follow on LinkedIn</span>
            <span className="block text-[13px] text-muted">
              New articles get shared there first — follow along, or check back here for the full write-up.
            </span>
          </span>
          <ArrowRight className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function PostText({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="m-0 text-2xl leading-[30px] font-semibold tracking-[-0.02em]">{post.title}</h3>
      <p className="m-0 text-[15px] leading-6 text-muted">{post.excerpt}</p>
    </div>
  );
}
