//
const metadata = {
  url: "https://compressed.app",
  title: "compressed.app - discover compressed NFTs",
  ogImage: "/og.png",
  twitter: "@nickfrosty",
  description:
    "Estimate costs for compressed NFTs. Discover the wonders of State Compression, and concurrent Merkle trees on Solana",
};

export default function Head() {
  return (
    <>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="robots" content="index,follow" />
      <link rel="icon" href="/favicon.ico" />

      <title>{metadata.title}</title>

      <meta name="twitter:card" content="summary_large" />
      <meta name="twitter:site" content={metadata.twitter} />
      <meta name="twitter:creator" content={metadata.twitter} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:url" content={metadata.url} />
      <meta
        property="og:image"
        content={`${metadata.url}${metadata.ogImage}`}
      />
      <meta property="og:site_name" content={metadata.title} />
      <meta property="og:image:alt" content={metadata.title} />
      {/* <meta property="og:image:width" content="256" />
      <meta property="og:image:height" content="256" /> */}
      <meta property="og:locale" content="en_US" />

      <meta name="description" content={metadata.description} />
      <meta property="og:description" content={metadata.description} />
    </>
  );
}
