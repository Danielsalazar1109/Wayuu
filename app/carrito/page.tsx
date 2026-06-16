"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../_components/cart/CartProvider";
import { formatCAD } from "../_lib/money";

export default function CartPage() {
  const { items, subtotalCOP, removeItem, setQuantity, clear } = useCart();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/#productos"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={() => clear()}
            className="inline-flex items-center justify-center rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30"
          >
            Clear
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-border bg-muted/30 p-10 text-center">
          <p className="text-base font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-foreground/70">
            Browse the collection and add your favorites.
          </p>
          <Link
            href="/#productos"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.slug}
                className="rounded-3xl border border-border bg-background p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Image
                      src={it.image ?? ""}
                      alt={it.name}
                      width={400}
                      height={300}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                    <p className="text-base font-semibold tracking-tight">{it.name}</p>
                    <p className="mt-1 text-sm text-foreground/70">
                      {formatCAD(it.priceCOP)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-foreground/70">
                      Qty.
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={it.quantity}
                        onChange={(e) => setQuantity(it.slug, Number(e.target.value))}
                        className="ml-2 w-20 rounded-xl border border-border bg-white/60 px-3 py-2 text-sm font-semibold dark:bg-black/30"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeItem(it.slug)}
                      className="rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-sm font-semibold">
                  Total: {formatCAD(it.priceCOP * it.quantity)}
                </p>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-white/60 p-6 shadow-sm dark:bg-black/30">
            <p className="text-base font-semibold">Summary</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-foreground/70">Subtotal</span>
              <span className="font-semibold">{formatCAD(subtotalCOP)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-foreground/70">Shipping</span>
              <span className="font-semibold">Calculated at checkout</span>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Total</span>
                <span className="text-lg font-semibold">{formatCAD(subtotalCOP)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              Go to checkout
            </Link>

            <p className="mt-4 text-xs text-foreground/60">
              Demo checkout (no real payments).
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
