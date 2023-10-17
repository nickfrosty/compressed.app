"use client";

import Image from "next/image";
import Link from "next/link";

type ComponentProps = {};

export default function AppHeader({}: ComponentProps) {
  return (
    <header className="container py-3">
      <nav className="items-center justify-between space-y-4 md:space-y-0 md:flex">
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

        <div className="flex justify-between gap-2">
          <Link href={"/advanced"} className="underline btn">
            Advanced Calculator
          </Link>
          <Link
            href={"https://docs.solana.com/learn/state-compression"}
            className="underline btn"
          >
            Learn More
          </Link>
        </div>
      </nav>
    </header>
  );
}
