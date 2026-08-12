import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/lib/answers";
import { getAnswer } from "@/lib/content";
import { getCategories } from "@/lib/questions";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/browse`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/winners`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${base}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categories = getCategories().map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const published = getPublishedSlugs().map((slug) => {
    const answer = getAnswer(slug);
    return {
      url: `${base}/q/${slug}`,
      lastModified: answer?.updatedAt ? new Date(answer.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...categories, ...published];
}
