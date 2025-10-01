"use client";

import { useEffect, useState } from "react";
import { auth, db, provider } from "../../lib/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ADMIN_UID = "qLmB6KeUHaVgwI5fs79pb0pSS7z2"; // 🔑 Replace with your UID

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [promptText, setPromptText] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.uid === ADMIN_UID) {
        setUser(u);
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.uid !== ADMIN_UID) {
        alert("You are not authorized as admin.");
        await signOut(auth);
        return;
      }
      setUser(result.user);
      setIsAdmin(true);
      console.log("Admin UID:", result.user.uid);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed, please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const handleUpload = async () => {
    if (!title.trim() || !slug.trim()) return alert("Title and slug required");
    if (!imageUrl.trim()) return alert("Please provide an image URL");

    setUploading(true);

    try {
      await addDoc(collection(db, "prompts"), {
        title: title.trim(),
        slug: slug.trim(),
        shortDescription: shortDescription.trim(),
        category: category.trim(),
        promptText: promptText.trim(),
        blogContent: blogContent.trim(),
        imageUrl: imageUrl.trim(),
        createdAt: serverTimestamp(),
      });
      alert("Prompt uploaded!");
      setTitle("");
      setSlug("");
      setShortDescription("");
      setCategory("");
      setPromptText("");
      setBlogContent("");
      setImageUrl("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Upload failed: " + message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        {!user ? (
          <div className="text-center">
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Login with Google
            </button>
            <p className="mt-3 text-gray-600">
              Only admin can upload prompts.
            </p>
          </div>
        ) : isAdmin ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div>
                <span className="mr-3">{user.displayName ?? "Admin"}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 border rounded"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                placeholder="Slug (unique)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                placeholder="Short Description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                <option value="Trending">Trending</option>
                <option value="Festival">Festival</option>
                <option value="Selfie">Selfie</option>
                <option value="Latest">Latest</option>
              </select>
              <textarea
                placeholder="Prompt Text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Blog Content (long form helpful for SEO)"
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Image URL (direct link ending .jpg/.png or Cloudinary/Imgur link)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`px-4 py-2 rounded text-white ${
                    uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload Prompt"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">Access Denied. Admin only.</p>
        )}
      </div>
    </div>
  );
}
