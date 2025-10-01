="use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Navbar from "../../../components/Navbar";
import Meta from "../../../components/Meta";
import Link from "next/link";
import Image from "next/image";

export default function PromptDetail() {
  const { slug } = useParams() as { slug: string };
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    const fetch = async () => {
      const q = query(collection(db, "prompts"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) setPrompt({ id: snap.docs[0].id, ...snap.docs[0].data() });

      const q2 = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
      const snap2 = await getDocs(q2);
      setTrendingPosts(snap2.docs.map((d) => ({ id: d.id, ...d.data() })).slice(0, 5));

      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) return <div><Navbar /><p className="p-4 text-center text-gray-500">Loading...</p></div>;
  if (!prompt) return <div><Navbar /><p className="p-4 text-center text-gray-500">Prompt not found.</p></div>;

  return (
    <>
      <Meta title={`${prompt.title} — AI Gemini Prompt`} description={prompt.shortDescription || ""} url={`${process.env.NEXT_PUBLIC_SITE_URL}/prompt/${prompt.slug}`} image={prompt.imageUrl} />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:flex lg:gap-10">
          <article className="flex-1 space-y-8">
            <div className="text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:underline">Home</Link> &gt; <span>{prompt.title}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{prompt.title}</h1>
            {prompt.imageUrl && (
              <div className="w-full h-96 relative rounded overflow-hidden">
                <Image src={prompt.imageUrl} alt={prompt.title} fill className="object-contain transition-transform duration-500 hover:scale-105" />
              </div>
            )}
            <pre className="whitespace-pre-wrap text-gray-800 text-sm select-all">{prompt.promptText}</pre>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-semibold text-gray-800">Instructions & Details</h2>
              <div>{prompt.blogContent}</div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingPosts.map(p => (
                  <Link key={p.id} href={`/prompt/${p.slug}`} className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
                    <div className="w-full aspect-square bg-gray-100 relative overflow-hidden">
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-xs uppercase tracking-wide text-blue-600 font-semibold">{p.category}</span>
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">{p.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          <aside className="hidden lg:block w-80 flex-shrink-0 space-y-8 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Trending Posts</h3>
            <div className="space-y-4">
              {trendingPosts.map(p => (
                <Link key={p.id} href={`/prompt/${p.slug}`} className="flex items-center gap-3 group">
                  <div className="w-20 h-20 bg-gray-200 overflow-hidden flex-shrink-0 rounded relative">
                    {p.imageUrl && <Image src={p.imageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div>
                    <h4 className="text-gray-900 group-hover:text-blue-600 transition-colors font-semibold line-clamp-2">{p.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
