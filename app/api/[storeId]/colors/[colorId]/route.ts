import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { colorId } }: { params: { colorId: string } }
) {
  try {
    if (!colorId)
      return new NextResponse("colorId is required", { status: 400 });

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return new NextResponse(JSON.stringify(color), { status: 200 });
  } catch (error) {
    console.log("[colorS][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { storeId, colorId },
  }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const { value, name } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!colorId)
      return new NextResponse("colorId is required", { status: 400 });
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });
    if (!name) return new NextResponse("name is required", { status: 400 });
    if (!value) return new NextResponse("value is required", { status: 400 });

    const color = await prismadb.color.update({
      data: {
        name,
        value,
      },
      where: {
        id: colorId,
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(color), { status: 201 });
  } catch (error) {
    console.log("[colorS][PATCH][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, colorId },
  }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!colorId)
      return new NextResponse("colorId is required", { status: 400 });

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const color = await prismadb.color.delete({
      where: {
        id: colorId,
        storeId,
      },
    });

    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.log("[colorS][DELETE][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
