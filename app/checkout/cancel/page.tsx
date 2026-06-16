import Link from "next/link";

type PageProps = {
  searchParams?: { order_id?: string | string[] };
};

export default function CheckoutCancelPage({ searchParams }: PageProps) {
  const raw = searchParams?.order_id;
  const orderId = Array.isArray(raw) ? raw[0] : raw;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-border bg-muted/30 p-10 text-center">
        <p className="text-2xl font-semibold tracking-tight">Pago cancelado</p>
        <p className="mt-3 text-sm text-foreground/70">
          No se realizó ningún cobro. Si quieres, puedes volver a intentarlo.
        </p>
        {orderId ? (
          <p className="mt-3 text-xs text-foreground/60">
            Tu información quedó guardada como orden draft: {orderId}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            Volver a checkout
          </Link>
          <Link
            href="/carrito"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white/60 px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30"
          >
            Ver carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
