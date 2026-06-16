import Stripe from "stripe";

import { markOrderPaid } from "@/app/_lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

type ConfirmBody = {
  sessionId: string;
};

function assertConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY env var");
  }
}

export async function POST(req: Request) {
  assertConfigured();

  let body: ConfirmBody;
  try {
    body = (await req.json()) as ConfirmBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body?.sessionId) {
    return Response.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(body.sessionId);

  if (session.payment_status !== "paid") {
    return Response.json(
      {
        error: `Payment not confirmed (payment_status=${session.payment_status})`,
      },
      { status: 400 }
    );
  }

  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  if (!orderId) {
    return Response.json(
      { error: "Missing orderId on Stripe session" },
      { status: 400 }
    );
  }

  const order = await markOrderPaid({
    orderId,
    stripeSessionId: session.id,
  });

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  return Response.json({ order });
}
