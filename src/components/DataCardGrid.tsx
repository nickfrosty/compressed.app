"use client";
import DataCard from "@/components/DataCard";
import { ComparisonCard } from "@/components/ComparisonCard";

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
        <DataCard key={id} treeData={treeData} cost={costListing[id]} />
      ))}

      <ComparisonCard treeNodes={treeNodes} />
    </section>
  );
}
