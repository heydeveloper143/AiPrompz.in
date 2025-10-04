// src/app/page.tsx
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";
import Meta from "../components/Meta";
import Link from "next/link";
import Image from "next/image";

interface Prompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  imageUrl?: string;
}

// ISR: rebuild page every 1 hour
export const revalidate = 3600; // seconds

export default async function Home() {
  // Fetch prompts from Firestore
  const q = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const prompts: Prompt[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Prompt, "id">),
  }));

  const trendingPosts = prompts.slice(0, 5);

  return (
    <>
      <Meta
        title="AI Gemini Trending Prompts Gallery – Trending AI Prompts 2025"
        description="Discover trending AI prompts (selfie, festival, creative). Copy prompts, browse categories and get inspired."
        url={process.env.NEXT_PUBLIC_SITE_URL}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trending AI Prompts
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Explore trending Gemini AI prompts crafted for creativity, fun, and inspiration.
          </p>
        </header>

        {/* Categories */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {["Trending", "Festival", "Selfie", "Latest"].map((c) => (
            <Link
              key={c}
              href={`/categories/${c}`}
              className="px-5 py-2 bg-blue-50 text-blue-700 font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition"
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Blog Layout */}
        {prompts.length === 0 ? (
          <p className="text-center text-gray-500">No prompts yet. Use the admin dashboard to add prompts.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Posts */}
            <div className="flex-1 space-y-12">
              {prompts.map((p) => (
                <div key={p.id} className="group">
                  <h2 className="text-2xl font-bold text-black mb-2">{p.title}</h2>
                  {p.imageUrl && (
                    <div className="w-full lg:w-[calc(100%+30px)] h-80 overflow-hidden mb-4 rounded-md relative">
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105 rounded-md"
                      />
                    </div>
                  )}
                  <p className="text-gray-700 mb-2">
                    {p.shortDescription || "Explore this AI prompt and get inspired."}
                  </p>
                  <Link href={`/prompt/${p.slug}`}>
                    <div className="cursor-pointer text-gray-900 font-medium bg-yellow-100 px-3 py-2 inline-block rounded hover:bg-yellow-200 transition">
                      Go to the full details and use the prompt
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <aside className="flex-none lg:w-80 mt-10 lg:mt-0 space-y-6">
              <h3 className="text-xl font-bold mb-4">Trending Posts</h3>
              <div className="space-y-4">
                {trendingPosts.map((p) => (
                  <Link key={p.id} href={`/prompt/${p.slug}`} className="flex items-center gap-3 group">
                    <div className="w-20 h-20 bg-gray-200 overflow-hidden flex-shrink-0 rounded relative">
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="text-gray-900 group-hover:text-blue-600 transition-colors font-semibold line-clamp-2">
                        {p.title}
                      </h4>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">{p.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
