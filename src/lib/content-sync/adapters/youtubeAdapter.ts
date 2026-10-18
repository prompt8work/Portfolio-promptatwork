import type { ContentAdapter, NormalizedContentItem, PrivacyStatus } from "../types";

type YouTubeSearchItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
  };
};

type YouTubeSearchResponse = {
  items: YouTubeSearchItem[];
  error?: { message: string };
};

type YouTubeVideosResponse = {
  items: { id: string; status: { privacyStatus: PrivacyStatus } }[];
  error?: { message: string };
};

// The YouTube Data API returns snippet.title/description with HTML
// entities escaped (observed directly against a real channel: an
// apostrophe comes back as "&#39;", not "'"). Left undecoded, that literal
// "&#39;" renders as-is in React (text content isn't HTML-decoded), and
// also corrupts the slug generated from the title. Decode both named
// entities and numeric (decimal/hex) entities before this ever reaches
// Sanity.
function decodeHtmlEntities(text: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    "#39": "'",
    nbsp: " ",
  };
  return text.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return named[entity] ?? match;
  });
}

// PRD §35: fetches the channel's uploads via the YouTube Data API v3
// `search` endpoint and normalizes each result into the common shape.
// Requires YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID — real credentials tied
// to the user's own YouTube channel, not something this codebase can
// guess or fabricate.
export class YouTubeAdapter implements ContentAdapter {
  source = "youtube" as const;

  constructor(private apiKey: string, private channelId: string, private maxResults = 25) {}

  async fetchItems(): Promise<NormalizedContentItem[]> {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("channelId", this.channelId);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(this.maxResults));

    const res = await fetch(url.toString());
    const data: YouTubeSearchResponse = await res.json();

    if (!res.ok) {
      throw new Error(`YouTube API error: ${data.error?.message ?? res.statusText}`);
    }

    // Only public videos are synced. Private and unlisted videos are the
    // channel owner's to share one-to-one, never something the site lists.
    const statuses = await this.fetchPrivacyStatuses(data.items.map((item) => item.id.videoId));
    return data.items
      .filter((item) => statuses.get(item.id.videoId) === "public")
      .map((item) => this.normalize(item));
  }

  // `search` doesn't report privacy, so each id is checked against
  // `videos?part=status`. A private or deleted video comes back with no
  // item at all when called with an API key, so it is reported as
  // "private": either way the site must not show it.
  async fetchPrivacyStatuses(videoIds: string[]): Promise<Map<string, PrivacyStatus>> {
    const statuses = new Map<string, PrivacyStatus>(videoIds.map((id) => [id, "private"]));
    // The videos endpoint accepts at most 50 ids per call.
    for (let i = 0; i < videoIds.length; i += 50) {
      const url = new URL("https://www.googleapis.com/youtube/v3/videos");
      url.searchParams.set("key", this.apiKey);
      url.searchParams.set("part", "status");
      url.searchParams.set("id", videoIds.slice(i, i + 50).join(","));

      const res = await fetch(url.toString());
      const data: YouTubeVideosResponse = await res.json();
      if (!res.ok) {
        throw new Error(`YouTube API error: ${data.error?.message ?? res.statusText}`);
      }
      for (const video of data.items) statuses.set(video.id, video.status.privacyStatus);
    }
    return statuses;
  }

  private normalize(item: YouTubeSearchItem): NormalizedContentItem {
    const videoId = item.id.videoId;
    const thumb = item.snippet.thumbnails.high ?? item.snippet.thumbnails.medium ?? item.snippet.thumbnails.default;
    return {
      source: "youtube",
      externalId: videoId,
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      title: decodeHtmlEntities(item.snippet.title),
      description: decodeHtmlEntities(item.snippet.description),
      thumbnailUrl: thumb?.url,
      publishedAt: item.snippet.publishedAt,
      privacyStatus: "public",
    };
  }
}
