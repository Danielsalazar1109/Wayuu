"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "../_components/cart/CartProvider";
import { formatCAD } from "../_lib/money";

type CustomerForm = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

type CreateCheckoutResponse =
  | { url: string; orderId?: string }
  | { error: string };

const inputClass =
  "mt-1 w-full rounded-xl border border-border bg-white/60 px-3 py-2 text-sm font-semibold dark:bg-black/30";

export default function CheckoutPage() {
  const { items, subtotalCOP } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState<CustomerForm>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "CO",
  });

  const canPay = useMemo(() => {
    if (items.length === 0) return false;
    if (!customer.fullName.trim()) return false;
    if (!customer.email.trim()) return false;

    // Address required
    if (!customer.addressLine1.trim()) return false;
    if (!customer.city.trim()) return false;
    if (!customer.region.trim()) return false;
    if (!customer.postalCode.trim()) return false;

    return true;
  }, [
    items.length,
    customer.fullName,
    customer.email,
    customer.addressLine1,
    customer.city,
    customer.region,
    customer.postalCode,
  ]);

  async function handlePay() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({ slug: it.slug, quantity: it.quantity })),
          customer: {
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone || undefined,
            addressLine1: customer.addressLine1,
            addressLine2: customer.addressLine2 || undefined,
            city: customer.city,
            region: customer.region,
            postalCode: customer.postalCode,
            country: customer.country || undefined,
          },
        }),
      });

      let data: CreateCheckoutResponse | null = null;
      try {
        data = (await res.json()) as CreateCheckoutResponse;
      } catch {
        // If backend returns an empty body or HTML, we'll fall back to a generic message.
      }

      if (!res.ok) {
        const message = data && "error" in data ? data.error : `Checkout failed (${res.status})`;
        throw new Error(message);
      }

      if (!data || !("url" in data) || !data.url) {
        throw new Error("Stripe did not return a checkout URL");
      }

      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Completa tus datos y paga seguro con Stripe.
          </p>
        </div>
        <Link
          href="/carrito"
          className="inline-flex items-center justify-center rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30"
        >
          Back to cart
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-border bg-muted/30 p-10 text-center">
          <p className="text-base font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-foreground/70">
            Add products and come back to checkout.
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
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <p className="text-base font-semibold">Datos del cliente</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-foreground/70 sm:col-span-2">
                  Nombre completo *
                  <input
                    value={customer.fullName}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    className={inputClass}
                    autoComplete="name"
                  />
                </label>

                <label className="text-sm text-foreground/70">
                  Email *
                  <input
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className={inputClass}
                    autoComplete="email"
                  />
                </label>

                <label className="text-sm text-foreground/70">
                  Teléfono
                  <input
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className={inputClass}
                    autoComplete="tel"
                  />
                </label>

                <label className="text-sm text-foreground/70 sm:col-span-2">
                  Dirección *
                  <input
                    value={customer.addressLine1}
                    onChange={(e) =>
                      setCustomer((prev) => ({
                        ...prev,
                        addressLine1: e.target.value,
                      }))
                    }
                    className={inputClass}
                    autoComplete="address-line1"
                  />
                </label>

                <label className="text-sm text-foreground/70 sm:col-span-2">
                  Apto / Torre / Detalle
                  <input
                    value={customer.addressLine2}
                    onChange={(e) =>
                      setCustomer((prev) => ({
                        ...prev,
                        addressLine2: e.target.value,
                      }))
                    }
                    className={inputClass}
                    autoComplete="address-line2"
                  />
                </label>

                <label className="text-sm text-foreground/70">
                  Ciudad *
                  <input
                    value={customer.city}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className={inputClass}
                    autoComplete="address-level2"
                  />
                </label>

                <label className="text-sm text-foreground/70">
                  Departamento / Región *
                  <input
                    value={customer.region}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, region: e.target.value }))
                    }
                    className={inputClass}
                    autoComplete="address-level1"
                  />
                </label>

                <label className="text-sm text-foreground/70">
                  Código postal *
                  <input
                    value={customer.postalCode}
                    onChange={(e) =>
                      setCustomer((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                    className={inputClass}
                    autoComplete="postal-code"
                  />
                </label>

                <label className="text-sm text-foreground/70">
                  País
                  <input
                    value={customer.country}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, country: e.target.value }))
                    }
                    className={inputClass}
                    autoComplete="country"
                  />
                </label>
              </div>

              <p className="mt-4 text-xs text-foreground/60">
                * Campos obligatorios.
              </p>
            </div>

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
                        {it.quantity} × {formatCAD(it.priceCOP)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatCAD(it.priceCOP * it.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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

            <button
              type="button"
              onClick={handlePay}
              disabled={loading || !canPay}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
            >
              {loading ? "Redirecting to Stripe..." : "Pay with card"}
            </button>

            {!canPay ? (
              <p className="mt-3 text-xs font-semibold text-foreground/60">
                Completa los campos obligatorios para continuar.
              </p>
            ) : null}

            {error ? (
              <p className="mt-4 text-xs font-semibold text-red-600">{error}</p>
            ) : null}

            <p className="mt-4 text-xs text-foreground/60">
              Serás redirigido a Stripe para completar el pago.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
