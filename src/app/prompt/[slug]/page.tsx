// src/app/prompt/[slug]/page.tsx
import Navbar from "../../../components/Navbar";
import Meta from "../../../components/Meta";
import PromptClient from "./PromptClient";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface Prompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  promptText: string;
  blogContent?: string;
  imageUrl?: string;
}

export const revalidate = 3600; // ISR: rebuild every 1 hour

interface PromptPageProps {
  params: { slug: string };
}

export default function PromptDetail({ params }: PromptPageProps) {
  const { slug } = params;

  return <PromptPageServer slug={slug} />;
}

// Wrap server logic in a separate async function
async function PromptPageServer({ slug }: { slug: string }) {
  let prompt: Prompt | null = null;
  let trendingPosts: Prompt[] = [];

  try {
    const q = query(collection(db, "prompts"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const doc = snap.docs[0].data();
      // Convert Firestore Timestamp to ISO string
      prompt = {
        id: snap.docs[0].id,
        title: doc.title,
        slug: doc.slug,
        shortDescription: doc.shortDescription,
        category: doc.category,
        promptText: doc.promptText,
        blogContent: doc.blogContent,
        imageUrl: doc.imageUrl,
      };
    }

    const q2 = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
    const snap2 = await getDocs(q2);
    trendingPosts = snap2.docs
      .filter((d) => d.id !== snap.docs[0]?.id)
      .map((d) => {
        const doc = d.data();
        return {
          id: d.id,
          title: doc.title,
          slug: doc.slug,
          shortDescription: doc.shortDescription,
          category: doc.category,
          promptText: doc.promptText,
          blogContent: doc.blogContent,
          imageUrl: doc.imageUrl,
        };
      })
      .slice(0, 5);
  } catch (err) {
    console.error("Firestore fetch error:", err);
  }

  return (
    <>
      <Meta
        title={`${prompt?.title || "Prompt"} — AI Gemini Prompt`}
        description={prompt?.shortDescription || "AI prompt from Gemini Gallery"}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/prompt/${slug}`}
        image={prompt?.imageUrl}
      />
      <Navbar />
      <PromptClient prompt={prompt} trendingPosts={trendingPosts} />
    </>
  );
}
