import "server-only";

import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type OrderCustomer = {
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

export type OrderItem = {
  slug: string;
  name: string;
  quantity: number;
  unitAmountCOP: number;
};

export type OrderStatus = "draft" | "paid" | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  currency: "cop";
  amountTotalCOP: number;
  stripeSessionId?: string;
};

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

async function ensureDir() {
  const dir = path.dirname(ORDERS_FILE);
  await fs.mkdir(dir, { recursive: true });
}

async function readAll(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]) {
  await ensureDir();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function createDraftOrder(input: {
  customer: OrderCustomer;
  items: OrderItem[];
}): Promise<Order> {
  const now = new Date().toISOString();

  const amountTotalCOP = input.items.reduce(
    (sum, it) => sum + it.unitAmountCOP * it.quantity,
    0
  );

  const order: Order = {
    id: randomUUID(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
    customer: input.customer,
    items: input.items,
    currency: "cop",
    amountTotalCOP,
  };

  const orders = await readAll();
  orders.unshift(order);
  await writeAll(orders);

  return order;
}

export async function markOrderPaid(args: {
  orderId: string;
  stripeSessionId: string;
}): Promise<Order | null> {
  const orders = await readAll();
  const idx = orders.findIndex((o) => o.id === args.orderId);
  if (idx === -1) return null;

  const updated: Order = {
    ...orders[idx],
    status: "paid",
    stripeSessionId: args.stripeSessionId,
    updatedAt: new Date().toISOString(),
  };

  orders[idx] = updated;
  await writeAll(orders);
  return updated;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((o) => o.id === orderId) ?? null;
}
