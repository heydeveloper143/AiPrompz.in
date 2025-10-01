"use client"; // client-side rendering for Firestore fetch & ads

// TypeScript fix for AdSense
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Navbar from "../../../components/Navbar";
import Meta from "../../../components/Meta";
import Link from "next/link";

interface Prompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  imageUrl?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore data
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch all prompts for trending
        const allQ = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
        const allSnap = await getDocs(allQ);
        const allData = allSnap.docs.map(d => ({ id: d.id, ...d.data() } as Prompt));
        setAllPrompts(allData);

        // Fetch category-specific prompts
        const catQ = query(
          collection(db, "prompts"),
          where("category", "==", slug),
          orderBy("createdAt", "desc")
        );
        const catSnap = await getDocs(catQ);
        const catData = catSnap.docs.map(d => ({ id: d.id, ...d.data() } as Prompt));
        setPrompts(catData);

        setLoading(false);
      } catch (err) {
        console.error("Firestore fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const trendingPosts = allPrompts.slice(0, 5);

  // Load AdSense dynamically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ads = document.querySelectorAll("ins.adsbygoogle");
      ads.forEach(ad => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.warn("AdSense push error:", e);
        }
      });
    }
  }, [prompts]);

  return (
    <>
      <Meta
        title={`${slug} AI Prompts – AI Gemini Gallery`}
        description={`Explore ${slug} AI prompts to boost your creativity.`}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/categories/${slug}`}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/">Home</Link> &gt; <span className="capitalize">{slug}</span>
        </div>

        {/* Page Title */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold capitalize">
            {slug} AI Prompts
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Explore curated {slug} prompts crafted for Gemini AI.
          </p>
        </header>

        {/* Content */}
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className="h-80 bg-gray-200 animate-pulse rounded-xl shadow-sm"
              />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <p className="text-center text-gray-500">
            No prompts found in {slug} category.
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Posts */}
            <div className="flex-1 space-y-12">
              {prompts.map(p => (
                <div key={p.id} className="group">
                  <h2 className="text-2xl font-bold text-black mb-2 text-left">
                    {p.title}
                  </h2>
                  <p className="text-gray-700 mb-2 max-w-5xl">{p.shortDescription}</p>
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full max-w-5xl mx-auto h-96 object-contain transition-transform duration-500 group-hover:scale-105 rounded-md"
                    />
                  )}
                  <div className="max-w-5xl mx-auto mt-4">
                    <Link href={`/prompt/${p.slug}`}>
                      <div className="cursor-pointer text-gray-900 font-medium bg-yellow-100 px-3 py-2 inline-block rounded hover:bg-yellow-200 transition">
                        Go to full details
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <aside className="flex-none lg:w-80 mt-10 lg:mt-0 space-y-6">
              <h3 className="text-xl font-bold mb-4">Trending Posts</h3>
              <div className="space-y-4">
                {trendingPosts.map(p => (
                  <Link
                    key={p.id}
                    href={`/prompt/${p.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-20 h-20 bg-gray-200 overflow-hidden flex-shrink-0 rounded">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h4 className="text-gray-900 group-hover:text-blue-600 transition-colors font-semibold line-clamp-2">
                        {p.title}
                      </h4>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {p.category}
                      </span>
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
