"use client";

import Image from "next/image";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import styles from "@/styles/DataCard.module.css";
import { numberFormatter } from "@/utils/helpers";

type ComponentProps = {
  treeData: TreeOptions;
  canopyDepth: number;
  maxDepth: number;
  cost: number;
};

export default function DataCard({
  maxDepth,
  canopyDepth,
  treeData,
  cost,
}: ComponentProps) {
  /**
   * NOTE: Each proof required to be included in transaction takes up 32 bytes
   * (similar to a PublicKey)
   */
  // calculate the proof bytes
  const proofBytes = (maxDepth - canopyDepth) * 32;

  return (
    <div className={styles.card}>
      <h4 className={styles.cost}>
        <Image
          src={"/logos/solana-icon-black.svg"}
          width={18}
          height={18}
          alt=""
          blurDataURL={"/logos/solana-icon-black.svg"}
        />
        <span>{cost ? `~${numberFormatter(cost)}` : "---"} SOL </span>
      </h4>

      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.label}>
              maxDepth
              {/* <InformationCircleIcon  /> */}
            </td>
            <td className={styles.value}>{maxDepth}</td>
          </tr>
          <tr>
            <td className={styles.label}>maxBufferSize</td>
            <td className={styles.value}>{treeData.maxBufferSize}</td>
          </tr>
          <tr>
            <td className={styles.label}>canopyDepth</td>
            <td className={styles.value}>{canopyDepth}</td>
          </tr>
          <tr>
            <td className={styles.label}>proof size</td>
            <td className={styles.value}>{maxDepth - canopyDepth}</td>
          </tr>
          <tr>
            <td className={styles.label}>proof bytes</td>
            <td className={styles.value}>{proofBytes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
