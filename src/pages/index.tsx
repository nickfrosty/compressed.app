"use client";

import type { NextSeoProps } from "next-seo";
import DefaultLayout from "@/layouts/default";
import { useEffect, useMemo, useState } from "react";

import { numberFormatter } from "@/utils/helpers";
import {
  getConcurrentMerkleTreeAccountSize,
  ALL_DEPTH_SIZE_PAIRS,
  ValidDepthSizePair,
} from "@solana/spl-account-compression";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import DataCardGrid from "@/components/DataCardGrid";

// define the default depth pair
const defaultDepthPair: ValidDepthSizePair = {
  maxDepth: 3,
  maxBufferSize: 8,
};

// define page specific seo settings
const seo: NextSeoProps = {
  title: "estimate costs for compressed NFTs",
};

export default function Page() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const [loading, setLoading] = useState<boolean>(false);

  const [treeNodes, setTreeNodes] = useState<string | number>(1_000_000);

  const [treeOptionsList, setTreeOptionsList] = useState<Array<TreeOptions>>(
    new Array(3),
  );
  const [costListing, setCostListing] = useState<Array<number>>(
    new Array(treeOptionsList.length),
  );

  // auto compute the closest tree depth to hold the desired number of nodes
  const closestTreeDepth = useMemo(() => {
    let maxDepth = defaultDepthPair.maxDepth;

    const nodes = parseInt(treeNodes.toString());
    if (!treeNodes || nodes <= 0) return maxDepth;

    /**
     * The only valid depthSizePairs are stored in the on-chain program and SDK
     */
    for (let i = 0; i <= ALL_DEPTH_SIZE_PAIRS.length; i++) {
      if (Math.pow(2, ALL_DEPTH_SIZE_PAIRS[i].maxDepth) >= nodes) {
        maxDepth = ALL_DEPTH_SIZE_PAIRS[i].maxDepth;
        break;
      }
    }

    // get the maxBufferSize for the closest maxDepth
    const maxBufferSize =
      ALL_DEPTH_SIZE_PAIRS.filter((pair) => pair.maxDepth == maxDepth)?.[0]
        ?.maxBufferSize ?? defaultDepthPair.maxBufferSize;

    // canopy depth must not be above 17 or else it no worky,
    const maxCanopyDepth = maxDepth >= 20 ? 17 : maxDepth;

    // set the treeOptionsList state
    setTreeOptionsList([
      {
        maxDepth,
        maxBufferSize,
        canopyDepth: 0,
      },
      {
        maxDepth,
        maxBufferSize,
        // negative numbers are bad :/
        canopyDepth: maxCanopyDepth - 3 >= 0 ? maxCanopyDepth - 3 : 0,
      },
      {
        maxDepth,
        maxBufferSize,
        canopyDepth: maxCanopyDepth,
      },
    ]);

    // finally return the computed closest maxDepth
    return maxDepth;
  }, [treeNodes]);

  // function to request the actual cost for to store each of the different tree sizes from the RPC
  async function getCostForAllTrees() {
    if (loading) return;
    setLoading(true);

    // define a list of promises to make
    const promises: Array<Promise<number>> = [];

    // gather the promises
    for (let i = 0; i < treeOptionsList.length; i++) {
      const requiredSpace = getConcurrentMerkleTreeAccountSize(
        treeOptionsList[i].maxDepth,
        treeOptionsList[i].maxBufferSize,
        treeOptionsList[i].canopyDepth,
      );
      promises.push(
        connection.getMinimumBalanceForRentExemption(requiredSpace),
      );
    }

    // make good on our promises
    Promise.all(promises).then((res) => {
      for (let i = 0; i < treeOptionsList.length; i++) {
        res[i] = res[i] / LAMPORTS_PER_SOL;
      }
      setCostListing(res);

      setLoading(false);
    });
  }

  // update the tree cost values when the treeNode changes
  useEffect(() => {
    (async () => {
      await getCostForAllTrees();
    })();
  }, [treeNodes]);

  return (
    <DefaultLayout seo={seo}>
      <main className="container py-10 space-y-8 md:py-20">
        <section className="space-y-4">
          <h1 className="text-4xl text-center">Compressed NFT Calculator</h1>

          <p className="text-center text-gray-500 ">
            How many compressed NFTs do you want to store?
          </p>

          <section className="space-y-6">
            <section className="flex items-center justify-center max-w-md mx-auto">
              <input
                type="number"
                name="input"
                id="input"
                min={1}
                className="max-w-[12rem] mx-auto font-mono text-xl text-center place-self-center"
                placeholder="Enter a number"
                value={treeNodes}
                onChange={(e) =>
                  setTreeNodes(
                    // do not allow numbers less than 1, or non-numbers
                    parseInt(e.target.value ?? 1)
                      ? parseInt(e.target.value)
                      : 1,
                  )
                }
              />
            </section>

            {/* <p className="text-center text-gray-500 ">
            Not sure on your NFT collection size? Choose one of these.
          </p>

          <section className="flex items-center justify-center gap-3 ">
            <button
              type="button"
              className="font-mono text-sm btn btn-blue"
              onClick={() => setTreeNodes(10_000)}
            >
              10,000 ?
            </button>
            <button
              type="button"
              className="font-mono text-sm btn btn-blue"
              onClick={() => setTreeNodes(25_000)}
            >
              25,000 ?
            </button>
            <button
              type="button"
              className="font-mono text-sm btn btn-blue"
              onClick={() => setTreeNodes(1_000_000)}
            >
              1,000,000 ?
            </button>
          </section> */}

            <p className="text-center text-gray-500 ">
              The closest tree depth of{" "}
              <span className="underline">{closestTreeDepth}</span> can store up
              to{" "}
              <span className="underline">
                {numberFormatter(Math.pow(2, closestTreeDepth))}
              </span>{" "}
              assets
            </p>

            <DataCardGrid
              treeOptionsList={treeOptionsList}
              treeNodes={parseInt(treeNodes.toString())}
              costListing={costListing}
            />
          </section>

          <p className="max-w-md mx-auto text-center text-gray-500">
            The cost of creating Compressed NFTs can vary based on the tree size
            values set at creation. These values cannot be changed once the tree
            is created.
          </p>
        </section>
      </main>
    </DefaultLayout>
  );
}
