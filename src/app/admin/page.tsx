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

const ADMIN_UID = "qLmB6KeUHaVgwI5fs79pb0pSS7z2"; // 🔑 Replace with your UID from console

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
    const result = await signInWithPopup(auth, provider);
    if (result.user.uid !== ADMIN_UID) {
      alert("You are not authorized as admin.");
      await signOut(auth);
      return;
    }
    setUser(result.user);
    setIsAdmin(true);
    console.log("Admin UID:", result.user.uid);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const handleUpload = async () => {
    if (!imageUrl) return alert("Please provide an image URL (Imgur, Cloudinary, etc.)");
    if (!title || !slug) return alert("Title and slug required");

    try {
      await addDoc(collection(db, "prompts"), {
        title,
        slug,
        shortDescription,
        category,
        promptText,
        blogContent,
        imageUrl,
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
    } catch (err: any) {
      alert("Upload failed: " + (err.message || err));
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
              Only admin can upload prompts. After login, copy your UID from
              console and put it into Firestore rules.
            </p>
          </div>
        ) : isAdmin ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div>
                <span className="mr-3">{user.displayName}</span>
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
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Upload Prompt
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