import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { value, name } = await req.json();

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) return new NextResponse("Store not found", { status: 404 });
    if (store.userId !== userId)
      return new NextResponse("Unauthorized", { status: 403 });
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!value) return new NextResponse("value is required", { status: 400 });
    if (!name) return new NextResponse("value is required", { status: 400 });

    const color = await prismadb.color.create({
      data: {
        value,
        name,
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(color), { status: 201 });
  } catch (error) {
    console.log("[COLORS][POST][ERROR]", error);
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
    const billboard = await prismadb.color.findMany({
      where: {
        storeId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), { status: 200 });
  } catch (error) {
    console.log("[COLORS][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
