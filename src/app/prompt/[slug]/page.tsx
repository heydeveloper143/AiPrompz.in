import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Navbar from "../../../components/Navbar";
import Meta from "../../../components/Meta";
import Link from "next/link";
import Image from "next/image";
import CopyPromptButton from "./CopyPromptButton"; // client component

type Prompt = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  category: string;
  shortDescription: string;
  promptText: string;
  blogContent?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

interface PromptDetailProps {
  params: { slug: string };
}

// Needed for static export to generate all dynamic routes
export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, "prompts"));
  return snapshot.docs.map(doc => ({ slug: (doc.data() as { slug: string }).slug }));
}

export default async function PromptDetail({ params }: PromptDetailProps) {
  const { slug } = params;

  // Fetch the single prompt
  const q = query(collection(db, "prompts"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty)
    return (
      <>
        <Navbar />
        <p className="p-4 text-center text-gray-500">Prompt not found.</p>
      </>
    );

  const doc = snap.docs[0];
  const data = doc.data() as Omit<Prompt, "id" | "createdAt" | "updatedAt"> & {
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };

  const prompt: Prompt = {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || null,
    updatedAt: data.updatedAt?.toDate?.() || null,
  };

  // Fetch trending posts
  const q2 = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
  const snap2 = await getDocs(q2);

  const trendingPosts: Prompt[] = snap2.docs
    .map(d => {
      const data = d.data() as Omit<Prompt, "id" | "createdAt" | "updatedAt"> & {
        createdAt?: Timestamp;
        updatedAt?: Timestamp;
      };
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      };
    })
    .slice(0, 5);

  return (
    <>
      <Meta
        title={`${prompt.title} — AI Gemini Prompt`}
        description={prompt.shortDescription}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/prompt/${prompt.slug}`}
        image={prompt.imageUrl}
      />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:flex lg:gap-10">
          <article className="flex-1 space-y-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
              <Link href="/">Home</Link> &gt;{" "}
              <Link href={`/categories/${prompt.category}`} className="capitalize hover:underline">
                {prompt.category}
              </Link>{" "}
              &gt; {prompt.title}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{prompt.title}</h1>

            {/* Featured Image */}
            {prompt.imageUrl && (
              <div className="relative w-full h-96 max-w-full">
                <Image
                  src={prompt.imageUrl}
                  alt={prompt.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            <p className="text-gray-700 text-lg">{prompt.shortDescription}</p>

            {/* Prompt Section */}
            <section>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-blue-700">Prompt</h2>
                <CopyPromptButton text={prompt.promptText} />
              </div>
              <pre className="whitespace-pre-wrap text-gray-800 text-sm select-all">{prompt.promptText}</pre>
            </section>

            {/* Blog Content */}
            {prompt.blogContent && (
              <section className="prose prose-lg max-w-none">
                <h2 className="font-semibold text-gray-800">Instructions & Details</h2>
                <div>{prompt.blogContent}</div>
              </section>
            )}

            {/* Related Articles */}
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingPosts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/prompt/${p.slug}`}
                    className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
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
          </article>
        </div>
      </main>
    </>
  );
}
