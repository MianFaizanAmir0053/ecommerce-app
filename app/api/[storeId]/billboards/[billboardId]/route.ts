import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params: { storeId, billboardId },
  }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const { label, imageUrl } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!billboardId)
      return new NextResponse("billboardId is required", { status: 400 });
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });
    if (!label) return new NextResponse("label is required", { status: 400 });
    if (!imageUrl)
      return new NextResponse("imageUrl is required", { status: 400 });

    const billboard = await prismadb.billboards.update({
      data: {
        label,
        imageUrl,
      },
      where: {
        id: billboardId,
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), { status: 201 });
  } catch (error) {
    console.log("[BILLBOARDS][PATCH][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, billboardId },
  }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prismadb.billboards.delete({
      where: {
        id: billboardId,
        storeId,
      },
    });

    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.log("[BILLBOARDS][DELETE][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params: { billboardId } }: { params: { billboardId: string } }
) {
  try {
    if (!billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

    const billboard = await prismadb.billboards.findUnique({
      where: {
        id: billboardId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), { status: 201 });
  } catch (error) {
    console.log("[BILLBOARDS][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
