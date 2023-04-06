"use client";

import Image from "next/image";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import styles from "@/styles/DataCard.module.css";
import { numberFormatter } from "@/utils/helpers";

type ComponentProps = {
  treeData: TreeOptions;
  cost: number;
};

export default function DataCard({ treeData, cost }: ComponentProps) {
  /**
   * NOTE: Each proof required to be included in transaction takes up 32 bytes
   * (similar to a PublicKey)
   */
  // calculate the proof bytes
  const proofSize = treeData.maxDepth - treeData.canopyDepth;
  const proofBytes = proofSize * 32;

  return (
    <div>
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
              <td className={styles.value}>{treeData.maxDepth}</td>
            </tr>
            <tr>
              <td className={styles.label}>maxBufferSize</td>
              <td className={styles.value}>{treeData.maxBufferSize}</td>
            </tr>
            <tr>
              <td className={styles.label}>canopyDepth</td>
              <td className={styles.value}>{treeData.canopyDepth}</td>
            </tr>
            <tr>
              <td className={styles.label}>proof size</td>
              <td className={styles.value}>{proofSize}</td>
            </tr>
            <tr>
              <td className={styles.label}>proof bytes</td>
              <td className={styles.value}>{proofBytes}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={`text-center`}>
          {proofSize == 3 ? "Uncompressed equivalent" : treeData.message}
        </h4>
      </div>
    </div>
  );
}
