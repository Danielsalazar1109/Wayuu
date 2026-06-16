import Stripe from "stripe";

import { products } from "@/app/_data/products";
import {
  createDraftOrder,
  type OrderCustomer,
  type OrderItem,
} from "@/app/_lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

type CheckoutRequestBody = {
  items: Array<{ slug: string; quantity: number }>;
  customer: OrderCustomer;
};

function clampQty(q: number) {
  if (!Number.isFinite(q)) return 1;
  return Math.max(1, Math.min(99, Math.floor(q)));
}

function toCadCents(amountCad: number) {
  if (!Number.isFinite(amountCad)) {
    throw new Error("Invalid product price");
  }
  // Stripe expects the smallest currency unit (cents) as an integer for CAD.
  return Math.round(amountCad * 100);
}

function normalizeCustomer(input: OrderCustomer): OrderCustomer {
  const fullName = (input.fullName ?? "").trim();
  const email = (input.email ?? "").trim();
  const phone = (input.phone ?? "").trim();

  const addressLine1 = (input.addressLine1 ?? "").trim();
  const city = (input.city ?? "").trim();
  const region = (input.region ?? "").trim();
  const postalCode = (input.postalCode ?? "").trim();

  if (!fullName) throw new Error("Missing customer fullName");
  if (!email) throw new Error("Missing customer email");

  // Address is required (requested)
  if (!addressLine1) throw new Error("Missing customer addressLine1");
  if (!city) throw new Error("Missing customer city");
  if (!region) throw new Error("Missing customer region");
  if (!postalCode) throw new Error("Missing customer postalCode");

  return {
    ...input,
    fullName,
    email,
    phone: phone || undefined,
    addressLine1,
    city,
    region,
    postalCode,
    addressLine2: (input.addressLine2 ?? "").trim() || undefined,
    country: (input.country ?? "CO").trim() || "CO",
  };
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Missing STRIPE_SECRET_KEY env var" },
        { status: 500 }
      );
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
    if (!origin) {
      return Response.json(
        { error: "Missing request origin and NEXT_PUBLIC_SITE_URL" },
        { status: 500 }
      );
    }

    let body: CheckoutRequestBody;
    try {
      body = (await req.json()) as CheckoutRequestBody;
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body?.items?.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    let customer: OrderCustomer;
    try {
      customer = normalizeCustomer(body.customer);
    } catch (e) {
      return Response.json(
        { error: e instanceof Error ? e.message : "Invalid customer" },
        { status: 400 }
      );
    }

    const orderItems: OrderItem[] = [];
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const it of body.items) {
      const qty = clampQty(it.quantity);
      const product = products.find((p) => p.slug === it.slug);

      if (!product) {
        return Response.json(
          { error: `Unknown product slug: ${it.slug}` },
          { status: 400 }
        );
      }

      const unit_amount_cad = product.priceCAD;
      const unit_amount_cents = toCadCents(unit_amount_cad);

      orderItems.push({
        slug: product.slug,
        name: product.name,
        quantity: qty,
        unitAmountCOP: unit_amount_cad,
      });

      line_items.push({
        quantity: qty,
        price_data: {
          currency: "cad",
          unit_amount: unit_amount_cents,
          product_data: {
            name: product.name,
          },
        },
      });
    }

    const order = await createDraftOrder({
      customer,
      items: orderItems,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customer.email,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        fullName: customer.fullName,
        phone: customer.phone ?? "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
    });

    return Response.json({ url: session.url, orderId: order.id });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
