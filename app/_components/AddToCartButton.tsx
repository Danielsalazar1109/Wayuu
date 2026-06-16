"use client";

import { useState } from "react";

import { products } from "../_data/products";

import { useCart } from "./cart/CartProvider";

export function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);  

  return (
    <button
      type="button"
      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
      disabled={loading}
      onClick={() => {
        const product = products.find((p) => p.slug === slug);
        if (!product) {
          throw new Error(`Product not found: ${slug}`);
        }

        setLoading(true);
        addItem(
          {
            slug: product.slug,
            name: product.name,
            priceCOP: product.priceCAD,
            image: product.image,
          },
          1
        );
        setLoading(false);
      }}
    >
      {loading ? "Adding..." : "Add to cart"}
    </button>
  )
}

