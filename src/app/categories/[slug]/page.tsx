import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Navbar from "../../../components/Navbar";
import Meta from "../../../components/Meta";
import Link from "next/link";
import Image from "next/image";

type Prompt = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  category: string;
  shortDescription: string;
  createdAt?: Date | null;
};

// Generate static params for Next.js export
export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, "prompts"));
  const categories = Array.from(new Set(snapshot.docs.map(doc => doc.data().category)));
  return categories.map(slug => ({ slug }));
}

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = params.slug;

  // Fetch all prompts
  const allQ = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
  const allSnap = await getDocs(allQ);
  const allPrompts: Prompt[] = allSnap.docs.map((d) => {
    const data = d.data() as Omit<Prompt, "id" | "createdAt"> & { createdAt?: Timestamp };
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || null,
    };
  });

  // Fetch category-specific prompts
  const catQ = query(
    collection(db, "prompts"),
    where("category", "==", slug),
    orderBy("createdAt", "desc")
  );
  const catSnap = await getDocs(catQ);
  const prompts: Prompt[] = catSnap.docs.map((d) => {
    const data = d.data() as Omit<Prompt, "id" | "createdAt"> & { createdAt?: Timestamp };
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || null,
    };
  });

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

        {prompts.length === 0 ? (
          <p className="text-center text-gray-500">No prompts found in {slug} category.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main posts */}
            <div className="flex-1 space-y-12">
              {prompts.map((p) => (
                <div key={p.id} className="group">
                  <h2 className="text-2xl font-bold text-black mb-2">{p.title}</h2>
                  <p className="text-gray-700 mb-2 max-w-5xl">{p.shortDescription}</p>

                  {p.imageUrl && (
                    <div className="relative w-full max-w-5xl h-96 mx-auto">
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        style={{ objectFit: "contain" }}
                        className="transition-transform duration-500 group-hover:scale-105 rounded-md"
                      />
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
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
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
