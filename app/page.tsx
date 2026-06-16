import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "./_components/AddToCartButton";

import { products } from "./_data/products";
import { formatCAD } from "./_lib/money";

export default function HomePage() {
  const productsByCategory = new Map<string, (typeof products)[number][]>();
  for (const product of products) {
    const category = product.category ?? "Uncategorized";
    const existing = productsByCategory.get(category);
    if (existing) {
      existing.push(product);
    } else {
      productsByCategory.set(category, [product]);
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden">
<div
  className="absolute inset-0 -z-10"
  style={{
    backgroundImage: "url(/images/background.png)",
    backgroundPosition: "center",
    backgroundSize: "cover",
  }}
/>
        <div className="absolute inset-x-0 top-0 -z-10 h-24" />

        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="hidden lg:block" />
            <div>
              <p className="inline-flex items-center rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-foreground/80 shadow-sm dark:bg-black/40">
                Made in Colombia. Wayuu Inspiration
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Wayuu Bags with colombian design
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/70">
                A clean, ready-to-sell storefront: product catalog, checkout
                flow, and cart. A great base for your brand.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#productos"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                >
                  View collection
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white/60 p-4 text-sm dark:bg-black/30">
                  <p className="font-semibold">Shipping</p>
                  <p className="mt-1 text-foreground/70">Victoria, BC</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/60 p-4 text-sm dark:bg-black/30">
                  <p className="font-semibold">Payments</p>
                  <p className="mt-1 text-foreground/70">Card (Stripe)</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/60 p-4 text-sm dark:bg-black/30">
                  <p className="font-semibold">Craftsmanship</p>
                  <p className="mt-1 text-foreground/70">Handwoven in Colombia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mt-10 space-y-12">
          {Array.from(productsByCategory.entries()).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{category}</h3>
                <p className="text-sm text-foreground/60">{items.length} products</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <div
                    key={p.slug}
                    className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm dark:bg-black/40"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted/40">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-base font-semibold tracking-tight">{p.name}</p>
                      <p className="mt-1 text-sm text-foreground/70">
                        {p.shortDescription}
                      </p>
                      <p className="mt-3 text-sm font-semibold">{formatCAD(p.priceCAD)}</p>
                      <p className="mt-1 text-xs text-foreground/60">{p.size}</p>
                      <AddToCartButton slug={p.slug} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="historia" className="border-t border-border bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                La Guajira tradition, designed for today
              </h2>
              <p className="mt-4 leading-7 text-foreground/70">
                Wayuu bags are a living cultural expression. This template helps
                you tell that story: community, technique, origin, and the value
                of craftsmanship.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground/80">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  Product cards with details (size, colors, artisan).
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-2" />
                  Persistent cart (localStorage) for a smooth experience.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-foreground/30" />
                  Styles ready to customize (palette, typography, copy).
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <Image
                src="/images/wayuu.jpg"
                alt="Wayuu bag"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
