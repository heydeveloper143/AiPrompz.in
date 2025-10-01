// src/components/Meta.tsx
import Head from "next/head";

export default function Meta({ title, description, url, image }: { title:string; description:string; url?:string; image?:string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      {url && <meta property="og:url" content={url}/>}
      {image && <meta property="og:image" content={image}/>}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
