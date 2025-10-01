import type { MetadataRoute } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export const dynamic = "force-static"; // ⚡ Tell Next.js this route is static

type ChangeFreq = "daily" | "always" | "hourly" | "weekly" | "monthly" | "yearly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  // Fetch all prompts from Firestore
  const q = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  const prompts = snap.docs.map(doc => ({
    slug: doc.data().slug,
    lastModified: doc.data().createdAt?.toDate() || new Date(),
  }));

  const weekly: ChangeFreq = "weekly";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: weekly,
      priority: 0.8,
    },
    ...prompts.map(p => ({
      url: `${baseUrl}/prompt/${p.slug}`,
      lastModified: p.lastModified,
      changeFrequency: weekly,
      priority: 0.7,
    })),
  ];
}
