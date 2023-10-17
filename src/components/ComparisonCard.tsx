import { memo } from "react";
import styles from "@/styles/DataCard.module.css";
import Image from "next/image";
import { numberFormatter } from "@/utils/helpers";

/**
 * the base cost of uncompressed NFTs (is SOL and not including tx fees):
 * - prior to metaplex fees: 0.012
 * - with current metaplex fees: 0.024
 */
const UNCOMPRESSED_COST: number = 0.024;

// define the base transaction cost
const TRANSACTION_COST: number = 0.000005;

type ComparisonCardProps = {
  treeNodes: number;
};

export const ComparisonCard = memo(({ treeNodes }: ComparisonCardProps) => {
  return (
    <>
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
          </span>{" "}
          for on-chain storage and Metaplex protocol fees. And a tree with proof
          size of <span className="underline">3</span> has the{" "}
          <span className="font-semibold">same</span> composability level as its
          uncompressed NFT counterpart.
        </p>
      </div>

      <div className={`col-span-full text-center`}>
        <p className="text-sm text-gray-500">
          *plus the transaction costs of ~
          {numberFormatter(TRANSACTION_COST * treeNodes).toString()} SOL to mint
          all {numberFormatter(treeNodes).toString()} NFTs.
        </p>
      </div>
    </>
  );
});
