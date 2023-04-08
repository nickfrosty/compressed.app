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

// make a simple, deduplicated list of the allowed depths
const allDepthSizes = ALL_DEPTH_SIZE_PAIRS.flatMap(
  (pair) => pair.maxDepth,
).filter((item, pos, self) => self.indexOf(item) == pos);

// extract the largest depth that is allowed
const largestDepth = allDepthSizes[allDepthSizes.length - 1];

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
    for (let i = 0; i <= allDepthSizes.length; i++) {
      if (Math.pow(2, allDepthSizes[i]) >= nodes) {
        maxDepth = allDepthSizes[i];
        break;
      }
    }

    // get the maxBufferSize for the closest maxDepth (reversing it to get the largest buffer by default)
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
        message: "Least composable, lowest cost",
      },
      {
        maxDepth,
        maxBufferSize,
        // negative numbers are bad :/
        canopyDepth: maxCanopyDepth - 3 >= 0 ? maxCanopyDepth - 3 : 0,
        message: "Highly composable, moderate cost",
      },
      {
        maxDepth,
        maxBufferSize,
        canopyDepth: maxCanopyDepth,
        message: "Most composable, highest cost",
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
        <section className="space-y-6">
          <section className="space-y-2">
            <h1 className="text-4xl text-center">Compressed NFT Calculator</h1>

            <p className="text-center text-gray-500">
              How many compressed NFTs do you want to store?
            </p>
          </section>

          <section className="space-y-2">
            <section className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="font-mono text-sm btn btn-blue hover:-mt-1"
                onClick={() => setTreeNodes(1_000_000)}
              >
                1 million
              </button>
              <button
                type="button"
                className="font-mono text-sm btn btn-blue hover:-mt-1"
                onClick={() => setTreeNodes(10_000_000)}
              >
                10 million
              </button>
              <button
                type="button"
                className="font-mono text-sm btn btn-blue hover:-mt-1"
                onClick={() => setTreeNodes(1_000_000_000)}
              >
                1 billion
              </button>
            </section>

            <p className="text-sm text-center text-gray-500">
              (or just type any number you want)
            </p>

            <section className="flex items-center justify-center max-w-md mx-auto">
              <input
                type="text"
                className="max-w-[12rem] mx-auto font-mono text-xl text-center place-self-center"
                placeholder="Enter a number"
                value={treeNodes.toLocaleString() ?? 1}
                onChange={(e) => {
                  // prepare the string value, remove commas
                  let value = e.target.value.replace(/,/g, "");

                  // prevent decimal values
                  if (value.lastIndexOf(".") >= 0)
                    value = value.substring(0, value.lastIndexOf("."));

                  // save the filtered and parsed number in the state, maintaining within the min/max values
                  setTreeNodes(
                    // do not allow numbers less than 1, or non-numbers
                    parseInt(value ?? 1)
                      ? // also only allow up to the max number of assets in the largest tree
                        parseInt(value) > Math.pow(2, largestDepth)
                        ? Math.pow(2, largestDepth)
                        : parseInt(value)
                      : 1,
                  );
                }}
              />
            </section>
          </section>

          <p className="text-center text-gray-500">
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
