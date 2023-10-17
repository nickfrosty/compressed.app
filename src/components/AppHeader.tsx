"use client";

import Image from "next/image";
import Link from "next/link";

type ComponentProps = {};

export default function AppHeader({}: ComponentProps) {
  return (
    <header className="container py-3">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={"/logo.svg"}
            width={32}
            height={32}
            alt="compressed.app logo"
            blurDataURL="/logo.svg"
          />
          <span className="inline-block text-2xl font-semibold tracking-tighter lowercase">
            compressed.app
          </span>
        </Link>

        {/* this will be a button that does later... */}
        <div className="">
          <Link href={"/advanced"} className="btn hover:underline">
            Advanced
          </Link>
          <Link
            href={"https://docs.solana.com/learn/state-compression"}
            className="btn hover:underline"
          >
            Learn More
          </Link>
        </div>
      </nav>
    </header>
  );
}
