"use client";

import { useState } from "react";
import type { Offering } from "../../lib/portfolio";
import OfferingCard, { FilterPills } from "../offerings/OfferingCard";

// Workshop / solution cards with category filter pills. Filters are derived
// from the cards' own categories, so adding a category adds a pill.

export default function OfferingsGrid({ items }: { items: Offering[] }) {
  const categories = [...new Set(items.map((o) => o.category))];
  const [filter, setFilter] = useState<string | null>(null);

  return (
    <>
      {categories.length > 1 && (
        <FilterPills
          className="mb-7 justify-center"
          options={[{ key: null, label: "All" }, ...categories.map((c) => ({ key: c, label: c }))]}
          active={filter}
          onSelect={setFilter}
        />
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((o) => !filter || o.category === filter)
          .map((o) => (
            <OfferingCard key={o._key} o={o} />
          ))}
      </div>
    </>
  );
}
