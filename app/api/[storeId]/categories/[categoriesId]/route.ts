import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params: { storeId, categoriesId },
  }: { params: { storeId: string; categoriesId: string } }
) {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!categoriesId)
      return new NextResponse("categoriesId is required", { status: 400 });
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("BillboardId is required", { status: 400 });

    const category = await prismadb.category.update({
      data: {
        name,
        billboardId,
      },
      where: {
        id: categoriesId,
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(category), { status: 201 });
  } catch (error) {
    console.log("[CATEGORY][PATCH][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, categoriesId },
  }: { params: { storeId: string; categoriesId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!categoriesId)
      return new NextResponse("categoriesId is required", { status: 400 });

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });
    await prismadb.category.delete({
      where: {
        id: categoriesId,
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
  { params: { categoriesId } }: { params: { categoriesId: string } }
) {
  try {
    if (!categoriesId)
      return new NextResponse("categoriesId is required", { status: 400 });

    const category = await prismadb.category.findUnique({
      where: {
        id: categoriesId,
      },
      include: {
        billboard: true,
      },
    });

    return new NextResponse(JSON.stringify(category), { status: 201 });
  } catch (error) {
    console.log("[CATEGORY][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
