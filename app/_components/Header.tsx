"use client";

import Link from "next/link";

import { useCart } from "./cart/CartProvider";

function Badge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold text-white">
      {value}
    </span>
  );
}

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">Waayu Bags</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 sm:flex">
          <Link href="/#productos" className="hover:text-foreground">
            Products
          </Link>
          <Link href="/#historia" className="hover:text-foreground">
            History
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="inline-flex items-center rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-white dark:bg-black/30"
          >
            Carrito
            <Badge value={totalItems} />
          </Link>
        </div>
      </div>
    </header>
  );
}
