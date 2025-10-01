import { MetadataRoute } from "next";
import admin from "firebase-admin";

const getAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return admin;
};

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

  try {
    const adminInstance = getAdmin();
    const snapshot = await adminInstance.firestore().collection("prompts").get();

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.slug && typeof data.slug === "string") {
        urls.push({
          url: `${baseUrl}/prompt/${data.slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }
    });
  } catch (e) {
    console.error("Sitemap fetch error:", e);
  }

  return urls;
}
