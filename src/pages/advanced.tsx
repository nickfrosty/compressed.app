"use client";

import type { NextSeoProps } from "next-seo";
import DefaultLayout from "@/layouts/default";
import { useCallback, useEffect, useMemo, useState } from "react";

import { numberFormatter } from "@/utils/helpers";
import {
  getConcurrentMerkleTreeAccountSize,
  ALL_DEPTH_SIZE_PAIRS,
  ValidDepthSizePair,
} from "@solana/spl-account-compression";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { ComparisonCard } from "@/components/ComparisonCard";
import DataCard from "@/components/DataCard";
import { allDepthSizes, defaultDepthPair } from "@/const";

// define page specific seo settings
const seo: NextSeoProps = {
  title: "compressed NFT calculator",
};

export default function Page() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const [loading, setLoading] = useState<boolean>(false);

  //
  const [maxDepth, setMaxDepth] = useState<ValidDepthSizePair["maxDepth"]>(
    defaultDepthPair.maxDepth,
  );

  //
  const [bufferSize, setBufferSize] = useState<
    ValidDepthSizePair["maxBufferSize"]
  >(defaultDepthPair.maxBufferSize);

  const [treeCost, setTreeCost] = useState<number>(0);
  const [canopyDepth, setCanopyDepth] = useState<number>(0);

  // canopy depth must not be above 17 or else it no worky,
  const maxCanopyDepth = useMemo(
    () => (maxDepth >= 20 ? 17 : maxDepth),
    [maxDepth],
  );

  /**
   *
   */
  const handleMaxDepthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      // alert(e.target.value);
      setMaxDepth(parseInt(e.target.value) as ValidDepthSizePair["maxDepth"]);

      // select the first valid buffer size for the newly selected depth
      setBufferSize(
        ALL_DEPTH_SIZE_PAIRS.find((pair) => pair.maxDepth == maxDepth)
          ?.maxBufferSize as ValidDepthSizePair["maxBufferSize"],
      );
    },
    [],
  );

  /**
   * Request the actual cost for to store the tree on chain
   */
  const getCostForTree = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const requiredSpace = getConcurrentMerkleTreeAccountSize(
      maxDepth,
      bufferSize,
      canopyDepth,
    );

    connection.getMinimumBalanceForRentExemption(requiredSpace).then((rent) => {
      setTreeCost(rent / LAMPORTS_PER_SOL);
      setLoading(false);
    });
  }, [maxDepth, bufferSize, canopyDepth]);

  useEffect(() => {
    getCostForTree();
  }, [maxDepth, bufferSize, canopyDepth]);

  return (
    <DefaultLayout seo={seo}>
      <main className="container py-10 space-y-8 md:py-20">
        <section className="space-y-6">
          <section className="space-y-2">
            <h1 className="text-4xl text-center">
              Advanced Compressed NFT Calculator
            </h1>

            <p className="max-w-md mx-auto text-center text-gray-500">
              The cost of creating Compressed NFTs is based on three parameters
              set at tree creation:
              <br />
              <span className="">max depth</span>,{" "}
              <span className="">max buffer size</span>, and{" "}
              <span className="">canopy depth</span>
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <section className="grid gap-4 p-4 border border-gray-300 rounded-xl">
              <div className="input-wrapper">
                <label htmlFor="depth">
                  Max depth{" "}
                  <span className="">
                    ({ALL_DEPTH_SIZE_PAIRS.length} available)
                  </span>
                  :
                </label>
                <select
                  className="w-full input"
                  name="depth"
                  id="depth"
                  onChange={handleMaxDepthChange}
                >
                  {allDepthSizes.map((depth, key) => (
                    <option key={key}>{depth}</option>
                  ))}
                </select>
              </div>

              <div className="input-wrapper">
                <label htmlFor="depth">
                  Max buffer size{" "}
                  <span className="">
                    (
                    {
                      ALL_DEPTH_SIZE_PAIRS.filter(
                        (pair) => pair.maxDepth == maxDepth,
                      ).length
                    }{" "}
                    available)
                  </span>
                  :
                </label>
                <select
                  className="w-full input"
                  name="depth"
                  id="depth"
                  disabled={!maxDepth}
                  onChange={(e) =>
                    setBufferSize(
                      parseInt(
                        e.target.value,
                      ) as ValidDepthSizePair["maxBufferSize"],
                    )
                  }
                >
                  {ALL_DEPTH_SIZE_PAIRS.filter(
                    (pair) => pair.maxDepth == maxDepth,
                  ).map((pair, key) => (
                    <option key={key}>{pair.maxBufferSize}</option>
                  ))}
                </select>
              </div>

              <div className="input-wrapper">
                <label htmlFor="depth">
                  Canopy depth{" "}
                  <span className="">(between 0 - {maxCanopyDepth})</span>:
                </label>
                <input
                  type="number"
                  className="w-full"
                  placeholder="Enter a canopy depth"
                  value={canopyDepth.toLocaleString() ?? 0}
                  min={0}
                  max={maxCanopyDepth}
                  step={1}
                  onChange={(e) => setCanopyDepth(parseInt(e.target.value))}
                  onBlur={(e) => {
                    if (!e.target.value) setCanopyDepth(0);
                  }}
                />
              </div>
            </section>

            <DataCard
              treeData={{
                canopyDepth: canopyDepth,
                maxBufferSize: bufferSize,
                maxDepth: maxDepth,
              }}
              cost={treeCost}
            />
          </section>

          <p className="text-center text-gray-500">
            A tree depth of <span className="underline">{maxDepth}</span> can
            store up to{" "}
            <span className="underline">
              {numberFormatter(Math.pow(2, maxDepth))}
            </span>{" "}
            assets
          </p>

          <ComparisonCard treeNodes={Math.pow(2, maxDepth)} />
        </section>
      </main>
    </DefaultLayout>
  );
}
