// src/app/terms-of-service/page.tsx
"use client";

import Navbar from "../../components/Navbar";

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10 prose prose-lg">
        <h1>Terms of Service</h1>

        <p>
          Welcome to AI Gemini Prompts. By accessing or using this website, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>

        <h2>Use of the Website</h2>
        <p>
          You may use the website for personal, non-commercial purposes. You may not use the site to distribute harmful content or engage in illegal activities.
        </p>

        <h2>Content</h2>
        <p>
          All prompts, images, and blog content provided on this site are for informational and creative purposes. You may copy prompts for personal use, but do not redistribute or claim them as your own.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          The website may display third-party ads (e.g., Google AdSense). These ads may use cookies or tracking technologies. We are not responsible for third-party content.
        </p>

        <h2>Privacy</h2>
        <p>
          Please review our <a href="/privacy-policy" className="underline text-blue-600">Privacy Policy</a> to understand how we handle personal information.
        </p>

        <h2>Disclaimer</h2>
        <p>
          AI Gemini Prompts provides content &quot;as is&quot; and makes no warranties about accuracy or completeness. Use at your own risk.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the website constitutes acceptance of any changes.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these Terms, contact us at: <a href="mailto:your@email.com">your@email.com</a>
        </p>
      </main>
    </>
  );
}
