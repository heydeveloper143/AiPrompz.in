// src/app/privacy-policy/page.tsx
"use client";

import Navbar from "../../components/Navbar";
import Meta from "../../components/Meta";

export default function PrivacyPolicy() {
  return (
    <>
      <Meta
        title="Privacy Policy – AI Gemini Prompt Gallery"
        description="Learn how AI Gemini Prompt Gallery handles cookies, ads, and user data."
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/privacy-policy`}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10 prose prose-lg">
        <h1>Privacy Policy</h1>

        <p>
          Your privacy is important to us. This website may display third-party ads provided by
          Google AdSense. These ads may use cookies to serve more relevant content and advertisements.
        </p>

        <p>
          We do not collect personal information unless you voluntarily provide it, for example via
          contact forms. Any data shared will never be sold to third parties.
        </p>

        <p>
          By using this site, you consent to the use of cookies and third-party ads as described in this
          policy.
        </p>

        <h2>Cookies</h2>
        <p>
          Cookies are small files stored on your device to enhance your experience. You can manage or
          disable cookies in your browser settings.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use services such as Google Analytics and Google AdSense which may collect data about
          your usage of this site. This data is anonymized and used to improve user experience and
          ad relevance.
        </p>

        <h2>Contact</h2>
        <p>
          For any questions or concerns about this Privacy Policy, reach us at:
          <br />
          <a href="mailto:jhonygaru727@gmail.com" className="underline text-blue-600 hover:text-blue-800">
            jhonygaru727@gmail.com
          </a>
        </p>
      </main>
    </>
  );
}
