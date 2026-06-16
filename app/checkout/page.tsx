"use client";

import Link from "next/link";

import { useCart } from "../_components/cart/CartProvider";
import { formatCOP } from "../_lib/money";

export default function CheckoutPage() {
  const { items, subtotalCOP, clear } = useCart();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Checkout de demostración (sin pagos reales).
          </p>
        </div>
        <Link
          href="/carrito"
          className="inline-flex items-center justify-center rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30"
        >
          Volver al carrito
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-border bg-muted/30 p-10 text-center">
          <p className="text-base font-semibold">No hay productos en tu carrito</p>
          <p className="mt-2 text-sm text-foreground/70">
            Agrega productos y luego vuelve a checkout.
          </p>
          <Link
            href="/#productos"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            Ir a productos
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
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-base font-semibold tracking-tight">{it.name}</p>
                    <p className="mt-1 text-sm text-foreground/70">
                      {it.quantity} × {formatCOP(it.priceCOP)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCOP(it.priceCOP * it.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-white/60 p-6 shadow-sm dark:bg-black/30">
            <p className="text-base font-semibold">Resumen</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-foreground/70">Subtotal</span>
              <span className="font-semibold">{formatCOP(subtotalCOP)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-foreground/70">Envío</span>
              <span className="font-semibold">Incluido (demo)</span>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Total</span>
                <span className="text-lg font-semibold">{formatCOP(subtotalCOP)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => clear()}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              Confirmar pedido (demo)
            </button>

            <p className="mt-4 text-xs text-foreground/60">
              Esto es un checkout de ejemplo. Aquí conectarías pagos/envíos reales.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
