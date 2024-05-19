import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) return new NextResponse("Store not found", { status: 404 });
    if (store.userId !== userId)
      return new NextResponse("Unauthorized", { status: 403 });
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(category), { status: 201 });
  } catch (error) {
    console.log("[CATEGORIES][POST][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    if (!storeId)
      return new NextResponse("storeId is required", { status: 400 });
    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
