import {
  ALL_DEPTH_SIZE_PAIRS,
  ValidDepthSizePair,
} from "@solana/spl-account-compression";

// make a simple, deduplicated list of the allowed depths
export const allDepthSizes = ALL_DEPTH_SIZE_PAIRS.flatMap(
  (pair) => pair.maxDepth,
).filter((item, pos, self) => self.indexOf(item) == pos);

// extract the largest depth that is allowed
export const largestDepth = allDepthSizes[allDepthSizes.length - 1];

// define the default depth pair
export const defaultDepthPair: ValidDepthSizePair = {
  maxDepth: 3,
  maxBufferSize: 8,
};
