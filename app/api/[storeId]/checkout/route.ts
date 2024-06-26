import { stripe } from "@/lib/stripe";

import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHearders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST , GET , OPTIONS, DELETE, PUT",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHearders });
}

export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();
  if (!productIds)
    return new NextResponse("Product id is required", { status: 400 });

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds.map((productId: string) => productId),
      },
    },
  });

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  products.forEach((product) => {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },

        unit_amount: +product.price * 100,
      },
      quantity: 1,
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId,
      isPaid: false,
      orderItem: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHearders });
}
