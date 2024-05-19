import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { productId } }: { params: { productId: string } }
) {
  try {
    if (!productId)
      return new NextResponse("productId is required", { status: 400 });

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.log("[PRODUCTS][GET][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { storeId, productId },
  }: { params: { storeId: string; productId: string } }
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

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!productId)
      return new NextResponse("productId is required", { status: 400 });
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

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismadb.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        name,
        categoryId,
        sizeId,
        colorId,
        price,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {},
        },
      },
    });

    const pro = await prismadb.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(pro), { status: 201 });
  } catch (error) {
    console.log("[PRODUCT][PATCH][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, productId },
  }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!productId)
      return new NextResponse("productId is required", { status: 400 });

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.log("[PRODUCT][DELETE][ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
