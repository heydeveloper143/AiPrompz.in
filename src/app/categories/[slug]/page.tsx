// src/app/category/[slug]/page.tsx
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

// ISR: rebuild page every 1 hour
export const revalidate = 3600; // seconds

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.slug;

  // Fetch prompts for this category
  const q = query(
    collection(db, "prompts"),
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  const prompts: Prompt[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Prompt, "id">),
  }));

  return (
    <>
      <Meta
        title={`AI Gemini – ${category} Prompts`}
        description={`Explore AI prompts in the ${category} category.`}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/categories/${category}`}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {category} Prompts
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Explore trending AI prompts in the {category} category.
          </p>
        </header>

        {prompts.length === 0 ? (
          <p className="text-center text-gray-500">No prompts in this category yet.</p>
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
          </div>
        )}
      </main>
    </>
  );
}
