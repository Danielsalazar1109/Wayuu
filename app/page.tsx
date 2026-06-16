import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "./_components/AddToCartButton";

import { products } from "./_data/products";
import { formatCOP } from "./_lib/money";

export default function HomePage() {
  const productsByCategory = new Map<string, (typeof products)[number][]>();
  for (const product of products) {
    const category = product.category ?? "Sin categoría";
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
                Una tienda limpia y lista para vender: catálogo, detalle de
                producto y carrito. Perfecta como base para tu marca.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#productos"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                >
                  Ver colección
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white/60 p-4 text-sm dark:bg-black/30">
                  <p className="font-semibold">Envío</p>
                  <p className="mt-1 text-foreground/70">A todo Victoria, BC</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/60 p-4 text-sm dark:bg-black/30">
                  <p className="font-semibold">Pagos</p>
                  <p className="mt-1 text-foreground/70">E-transfer o cash</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/60 p-4 text-sm dark:bg-black/30">
                  <p className="font-semibold">Artesanía</p>
                  <p className="mt-1 text-foreground/70">Tradicional de las tierras colombianas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Productos</h2>
            <p className="mt-2 text-sm text-foreground/70">
              Productos ejemplo para el template. Cambia nombres, precios y
              colecciones.
            </p>
          </div>
          <Link
            href="/#productos"
            className="hidden rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-white sm:inline-flex dark:bg-black/30"
          >
            Ver todo
          </Link>
        </div>

        <div className="mt-10 space-y-12">
          {Array.from(productsByCategory.entries()).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{category}</h3>
                <p className="text-sm text-foreground/60">{items.length} productos</p>
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
                      <p className="mt-3 text-sm font-semibold">{formatCOP(p.priceCOP)}</p>
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
                Tradición de La Guajira, diseño para hoy
              </h2>
              <p className="mt-4 leading-7 text-foreground/70">
                Las mochilas Wayuu son una expresión cultural viva. Este template
                está pensado para que cuentes esa historia: comunidad, técnica,
                origen y valor artesanal.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground/80">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  Fichas de producto con detalles (tamaño, colores, artesana).
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-2" />
                  Carrito persistente (localStorage) para experiencia fluida.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-foreground/30" />
                  Estilos listos para personalizar (paleta, tipografía, copy).
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <div className="aspect-[16/10] rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand)_22%,transparent),transparent_40%),radial-gradient(circle_at_60%_40%,color-mix(in_oklab,var(--brand-2)_25%,transparent),transparent_55%)]" />
              <p className="mt-4 text-sm text-foreground/70">
                Aquí puedes poner una foto real: artesana, proceso, o una escena
                de La Guajira.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-border bg-background p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                Listo para vender
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                Conecta tu pasarela de pago, agrega fotos reales y publica.
              </p>
            </div>
            <Link
              href="/#productos"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              Empezar con el catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
