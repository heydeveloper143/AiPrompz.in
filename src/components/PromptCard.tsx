// src/components/PromptCard.tsx
import Link from "next/link";
import Image from "next/image";

type Prompt = {
  slug: string;
  title: string;
  imageUrl: string;
  category: string;
  shortDescription?: string;
};

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <Link href={`/prompt/${prompt.slug}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 overflow-hidden mb-8">
        {/* Featured Image */}
        <div className="w-full h-64 bg-gray-200 overflow-hidden relative">
          <Image
            src={prompt.imageUrl}
            alt={prompt.title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {prompt.title}
          </h2>
          {prompt.shortDescription && (
            <p className="mt-3 text-gray-700 text-base line-clamp-4">
              {prompt.shortDescription}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
              {prompt.category}
            </span>
            <span className="text-gray-400 text-sm">Read full instructions</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
