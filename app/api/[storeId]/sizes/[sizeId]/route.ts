import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { sizeId } }: { params: { sizeId: string } }
) {
  try {
    if (!sizeId) return new NextResponse("sizeId is required", { status: 400 });

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return new NextResponse(JSON.stringify(size), { status: 200 });
  } catch (error) {
    console.log("[sizeS][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { storeId, sizeId },
  }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const { value, name } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!sizeId) return new NextResponse("sizeId is required", { status: 400 });
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });
    if (!name) return new NextResponse("name is required", { status: 400 });
    if (!value) return new NextResponse("value is required", { status: 400 });

    const size = await prismadb.size.update({
      data: {
        name,
        value,
      },
      where: {
        id: sizeId,
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(size), { status: 201 });
  } catch (error) {
    console.log("[SIZES][PATCH][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, sizeId },
  }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!sizeId) return new NextResponse("sizeId is required", { status: 400 });

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const size = await prismadb.size.delete({
      where: {
        id: sizeId,
        storeId,
      },
    });

    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.log("[SIZES][DELETE][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
