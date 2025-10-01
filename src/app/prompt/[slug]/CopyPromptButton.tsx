"use client";

interface Props {
  text: string;
}

export default function CopyPromptButton({ text }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <button
      onClick={handleCopy}
      className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Copy
    </button>
  );
}
