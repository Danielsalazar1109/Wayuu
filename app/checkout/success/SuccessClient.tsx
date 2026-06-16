"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

import { useCart } from "../../_components/cart/CartProvider";
import { formatCAD } from "../../_lib/money";

type Order = {
  id: string;
  status: string;
  amountTotalCOP: number;
  currency: string;
  customer: {
    fullName: string;
    email: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{ slug: string; name: string; quantity: number; unitAmountCOP: number }>;
};

type ConfirmResponse =
  | { order: Order }
  | { error: string };

type EmailStatus = "idle" | "sending" | "sent" | "error";

export default function SuccessClient({ sessionId }: { sessionId: string }) {
  const { clear } = useCart();
  const [status, setStatus] = useState<"verifying" | "ok" | "error">(
    "verifying"
  );
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailError, setEmailError] = useState<string | null>(null);

  const emailConfig = useMemo(() => {
    return {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!sessionId) {
        setStatus("error");
        setError("Missing session_id");
        return;
      }

      try {
        const res = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = (await res.json()) as ConfirmResponse;

        if (!res.ok) {
          throw new Error("error" in data ? data.error : "Confirmation failed");
        }

        if (cancelled) return;

        if ("order" in data && data.order?.id) {
          setOrder(data.order);
        }

        setStatus("ok");
        clear();
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [sessionId, clear]);

  useEffect(() => {
    let cancelled = false;

    async function send() {
      if (!order) return;
      if (emailStatus !== "idle") return;

      // Avoid double-sending on refresh.
      try {
        const key = `email_sent_${order.id}`;
        if (typeof window !== "undefined" && window.sessionStorage.getItem(key)) {
          return;
        }
      } catch {
        // ignore
      }

      if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
        setEmailStatus("error");
        setEmailError(
          "Falta configurar EmailJS (NEXT_PUBLIC_EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY)"
        );
        return;
      }

      const itemsText = order.items
        .map((it) => `${it.quantity} x ${it.name} (${formatCAD(it.unitAmountCOP)})`)
        .join("\n");

      const address = [
        order.customer.addressLine1,
        order.customer.addressLine2,
        order.customer.city,
        order.customer.region,
        order.customer.postalCode,
        order.customer.country,
      ]
        .filter(Boolean)
        .join(", ");

      setEmailStatus("sending");
      setEmailError(null);

      try {
        await emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          {
            order_id: order.id,
            full_name: order.customer.fullName,
            customer_email: order.customer.email,
            phone: order.customer.phone ?? "",
            address,
            total_cop: formatCAD(order.amountTotalCOP),
            items: itemsText,
          },
          {
            publicKey: emailConfig.publicKey,
          }
        );

        if (cancelled) return;

        try {
          const key = `email_sent_${order.id}`;
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(key, "1");
          }
        } catch {
          // ignore
        }

        setEmailStatus("sent");
      } catch (e) {
        if (cancelled) return;
        setEmailStatus("error");
        setEmailError(e instanceof Error ? e.message : "EmailJS send failed");
      }
    }

    send();

    return () => {
      cancelled = true;
    };
  }, [order, emailStatus, emailConfig]);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-border bg-muted/30 p-10 text-center">
        {status === "verifying" ? (
          <>
            <p className="text-2xl font-semibold tracking-tight">Confirmando pago…</p>
            <p className="mt-3 text-sm text-foreground/70">
              Estamos verificando tu compra con Stripe.
            </p>
          </>
        ) : status === "ok" ? (
          <>
            <p className="text-2xl font-semibold tracking-tight">Pago confirmado</p>
            <p className="mt-3 text-sm text-foreground/70">
              Gracias. Tu pedido quedó guardado.
            </p>
            {order?.id ? (
              <p className="mt-3 text-xs text-foreground/60">Orden: {order.id}</p>
            ) : null}

            {emailStatus === "sending" ? (
              <p className="mt-3 text-xs text-foreground/60">Enviando email…</p>
            ) : emailStatus === "sent" ? (
              <p className="mt-3 text-xs text-foreground/60">Email enviado.</p>
            ) : emailStatus === "error" ? (
              <p className="mt-3 text-xs font-semibold text-red-600">
                {emailError ?? "No se pudo enviar el email."}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold tracking-tight">No pudimos confirmar</p>
            <p className="mt-3 text-sm text-foreground/70">
              {error ?? "Algo falló al confirmar el pago."}
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#productos"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white/60 px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-white dark:bg-black/30"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
