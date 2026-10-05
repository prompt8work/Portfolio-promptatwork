"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OfferingCard, { FilterPills } from "../offerings/OfferingCard";
import { trainingCategories, trainings, trainingToOffering } from "../../lib/trainings";

// The /training workshop cards with category tabs. The active tab lives in
// the URL (/training?category=technical) so any tab can be linked to
// directly; each tab is a link, so it works from the keyboard as-is.

const options = [
  { key: null, label: "All", href: "/training" },
  ...trainingCategories.map((c) => ({ key: c.slug, label: c.label, href: `/training?category=${c.slug}` })),
];

function Grid({ active }: { active: string | null }) {
  const category = trainingCategories.find((c) => c.slug === active);
  const items = trainings.filter((t) => !category || t.category === category.label);
  return (
    <>
      <FilterPills theme="light" className="mb-7" options={options} active={category ? category.slug : null} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((t) => (
          <OfferingCard key={t.slug} o={trainingToOffering(t)} theme="light" linkCard />
        ))}
      </div>
    </>
  );
}

function GridFromUrl() {
  return <Grid active={useSearchParams().get("category")} />;
}

export default function TrainingGrid() {
  // The fallback is what's prerendered: every card, "All" selected.
  return (
    <Suspense fallback={<Grid active={null} />}>
      <GridFromUrl />
    </Suspense>
  );
}
