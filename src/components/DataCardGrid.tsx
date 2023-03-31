"use client";

import Image from "next/image";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import styles from "@/styles/DataCard.module.css";
import { numberFormatter } from "@/utils/helpers";
import DataCard from "@/components/DataCard";

// define the base cost of uncompressed NFTs (is SOL)
const UNCOMPRESSED_COST: number = 0.012;

type ComponentProps = {
  treeOptionsList: TreeOptions[];
  treeNodes: number;
  costListing: number[];
};

export default function DataCardGrid({
  treeOptionsList,
  treeNodes,
  costListing,
}: ComponentProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {treeOptionsList.map((treeData, id) => (
        <DataCard
          key={id}
          treeData={treeData}
          maxDepth={treeData.maxDepth}
          canopyDepth={treeData.canopyDepth}
          cost={costListing[id]}
        />
      ))}

      <div className={`${styles.card} col-span-full text-center`}>
        <div className="items-center justify-center gap-2 text-center md:flex">
          <h4 className={`${styles.cost}  justify-center`}>
            <span>vs</span>
            <Image
              src={"/logos/solana-icon-black.svg"}
              width={18}
              height={18}
              alt=""
              blurDataURL={"/logos/solana-icon-black.svg"}
            />
            <span>
              ~{numberFormatter(UNCOMPRESSED_COST * treeNodes).toString()} SOL{" "}
            </span>
          </h4>
          <span className={`${styles.cost}  justify-center`}>
            for the uncompressed equivalent
          </span>
        </div>
        <p className="text-gray-500">
          Each uncompressed NFT costs approximately{" "}
          <span className="underline">
            {numberFormatter(UNCOMPRESSED_COST)} SOL
          </span>
          . And a tree with proof size of <span className="underline">3</span>{" "}
          has the <span className="font-semibold">same</span> composability
          level as its uncompressed NFT counterpart.
        </p>
      </div>
    </section>
  );
}
