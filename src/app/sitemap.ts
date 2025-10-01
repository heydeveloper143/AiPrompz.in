import type { MetadataRoute } from "next";
import admin from "firebase-admin";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  // Fetch all prompts from Firestore
  const snap = await db.collection("prompts").orderBy("createdAt", "desc").get();
  const prompts = snap.docs.map(doc => ({
    slug: doc.data().slug,
    lastModified: doc.data().createdAt?.toDate() || new Date(),
  }));

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
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Add category pages dynamically (optional)
    ...["Trending", "Festival", "Selfie", "Latest"].map(category => ({
      url: `${baseUrl}/categories/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    // Add prompt detail pages
    ...prompts.map(p => ({
      url: `${baseUrl}/prompt/${p.slug}`,
      lastModified: p.lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
