import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const {
      name,
      categoryId,
      sizeId,
      colorId,
      price,
      isArchived,
      isFeatured,
      images,
    } = await req.json();

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) return new NextResponse("Store not found", { status: 404 });
    if (store.userId !== userId)
      return new NextResponse("Unauthorized", { status: 403 });
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("value is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("categoryId is required", { status: 400 });
    if (!sizeId) return new NextResponse("sizeId is required", { status: 400 });
    if (!colorId)
      return new NextResponse("colorId is required", { status: 400 });
    if (!price) return new NextResponse("price is required", { status: 400 });
    if (typeof isArchived !== "boolean")
      return new NextResponse("isArchived is required", { status: 400 });
    if (typeof isFeatured !== "boolean")
      return new NextResponse("isFeatured is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("images is required", { status: 400 });

    const product = await prismadb.product.create({
      data: {
        name,
        categoryId,
        sizeId,
        colorId,
        price,
        isArchived,
        isFeatured,
        storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.log("[PRODUCTS][POST][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;

    if (!storeId)
      return new NextResponse("storeId is required", { status: 400 });

    const product = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.log("[PRODUCTS][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
