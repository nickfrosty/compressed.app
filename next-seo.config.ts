import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  // configure the title settings
  title: "compressed.app",
  titleTemplate: `compressed.app - %s`,
  defaultTitle: "compressed.app",
  description:
    "Estimate costs for compressed NFTs. Discover the wonders of State Compression, and concurrent Merkle trees on Solana",

  // social media card data
  openGraph: {
    site_name: "compressed.app",
    locale: "en_US",
    type: "website",
    url: "https://compressed.app/",
    images: [
      {
        url: "https://compressed.app/og-simple.png",
        // width: 256,
        // height: 256,
        alt: "compressed.app",
      },
    ],
  },
  twitter: {
    handle: `@nickfrosty`,
    site: `@nickfrosty`,
    // cardType: "summary",
    cardType: "summary_large_image",
  },
};

export default config;
