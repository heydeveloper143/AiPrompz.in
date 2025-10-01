import { MetadataRoute } from "next";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const categories = ["Trending", "Festival", "Selfie", "Latest"];
  const urls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, changeFrequency: "daily", priority: 1.0 },
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Optionally fetch prompts from Firestore
  const snapshot = await admin.firestore().collection("prompts").get();
  snapshot.docs.forEach((doc) => {
    urls.push({
      url: `${baseUrl}/prompt/${doc.data().slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  });

  return urls;
}
