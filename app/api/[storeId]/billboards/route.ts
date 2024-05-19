import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { label, imageUrl } = await req.json();

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) return new NextResponse("Store not found", { status: 404 });
    if (store.userId !== userId)
      return new NextResponse("Unauthorized", { status: 403 });
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!label) return new NextResponse("label is required", { status: 400 });
    if (!imageUrl)
      return new NextResponse("imageUrl is required", { status: 400 });

    const billboard = await prismadb.billboards.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), { status: 201 });
  } catch (error) {
    console.log("[BILLBOARDS][POST][ERROR]", error);
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
    const billboard = await prismadb.billboards.findMany({
      where: {
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), { status: 200 });
  } catch (error) {
    console.log("[BILLBOARDS][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
