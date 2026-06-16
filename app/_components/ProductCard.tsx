import Image from "next/image";

import type { Product } from "../_data/products";
import { formatCAD } from "../_lib/money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm dark:bg-black/40">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted/40">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={600}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-4">
        <p className="text-base font-semibold tracking-tight">{product.name}</p>
        <p className="mt-1 text-sm text-foreground/70">{product.shortDescription}</p>
        <p className="mt-3 text-sm font-semibold">{formatCAD(product.priceCAD)}</p>
        <p className="mt-1 text-xs text-foreground/60">{product.size}</p>
      </div>
    </div>
  );
}
