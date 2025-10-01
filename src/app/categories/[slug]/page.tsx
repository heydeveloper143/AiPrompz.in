"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Navbar from "../../../components/Navbar";
import Meta from "../../../components/Meta";
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

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      const allQ = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
      const allSnap = await getDocs(allQ);
      setAllPrompts(allSnap.docs.map(d => ({ id: d.id, ...d.data() } as Prompt)));

      const catQ = query(
        collection(db, "prompts"),
        where("category", "==", slug),
        orderBy("createdAt", "desc")
      );
      const catSnap = await getDocs(catQ);
      setPrompts(catSnap.docs.map(d => ({ id: d.id, ...d.data() } as Prompt)));
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  const trendingPosts = allPrompts.slice(0, 5);

  return (
    <>
      <Meta
        title={`${slug} AI Prompts – AI Gemini Gallery`}
        description={`Explore ${slug} AI prompts to boost your creativity.`}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/categories/${slug}`}
      />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/">Home</Link> &gt; <span className="capitalize">{slug}</span>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold capitalize">{slug} AI Prompts</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Explore curated {slug} prompts crafted for Gemini AI.
          </p>
        </header>

        {loading ? (
          <div className="space-y-8">
            {[1,2,3].map(n => <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-xl shadow-sm" />)}
          </div>
        ) : prompts.length === 0 ? (
          <p className="text-center text-gray-500">No prompts found in {slug} category.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-12">
              {prompts.map(p => (
                <div key={p.id} className="group">
                  <h2 className="text-2xl font-bold text-black mb-2 text-left">{p.title}</h2>
                  <p className="text-gray-700 mb-2 max-w-5xl">{p.shortDescription}</p>
                  {p.imageUrl && (
                    <div className="w-full h-96 max-w-5xl mx-auto relative rounded-md overflow-hidden">
                      <Image src={p.imageUrl} alt={p.title} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                    </div>
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

            <aside className="flex-none lg:w-80 mt-10 lg:mt-0 space-y-6">
              <h3 className="text-xl font-bold mb-4">Trending Posts</h3>
              <div className="space-y-4">
                {trendingPosts.map(p => (
                  <Link key={p.id} href={`/prompt/${p.slug}`} className="flex items-center gap-3 group">
                    <div className="w-20 h-20 bg-gray-200 overflow-hidden flex-shrink-0 rounded relative">
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                    </div>
                    <div>
                      <h4 className="text-gray-900 group-hover:text-blue-600 transition-colors font-semibold line-clamp-2">{p.title}</h4>
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
