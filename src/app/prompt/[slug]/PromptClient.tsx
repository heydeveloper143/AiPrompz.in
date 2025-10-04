// src/app/prompt/[slug]/PromptClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Fix TypeScript for AdSense ---
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

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

interface Props {
  prompt: Prompt | null;
  trendingPosts: Prompt[];
}

export default function PromptClient({ prompt, trendingPosts }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger AdSense on client
    if (typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push error:", e);
      }
    }
  }, []);

  if (!prompt) return <p className="p-4 text-center text-gray-500">Prompt not found.</p>;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="lg:flex lg:gap-10">
        {/* Main Article */}
        <article className="flex-1 space-y-8">
          <div className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:underline">Home</Link> &gt; <span>{prompt.title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{prompt.title}</h1>

          {prompt.imageUrl && (
            <div className="relative w-full h-96 mb-4">
              <Image
                src={prompt.imageUrl}
                alt={prompt.title}
                fill
                className="object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          <pre className="whitespace-pre-wrap text-gray-800 text-sm select-all">{prompt.promptText}</pre>

          <div className="prose prose-lg max-w-none">
            <h2 className="font-semibold text-gray-800">Instructions & Details</h2>
            <div>{prompt.blogContent}</div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {copied ? "Copied!" : "Copy Prompt"}
          </button>

          {/* AdSense */}
          <ins
            className="adsbygoogle block my-8"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXX"
            data-ad-slot="1111111111"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>

          {trendingPosts.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold mb-6">Related Prompts</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingPosts.map((p) => (
                  <Link key={p.id} href={`/prompt/${p.slug}`} className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
                    <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                      {p.imageUrl && (
                        <Image src={p.imageUrl} alt={p.title} width={400} height={400} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-xs uppercase tracking-wide text-blue-600 font-semibold">{p.category}</span>
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">{p.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
