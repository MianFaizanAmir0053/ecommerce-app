import prismadb from "@/lib/prismadb";
import React from "react";
import ProductForm from "./components/ProductForm";

type ProductProps = {
  params: {
    productId: string;
    storeId: string;
  };
};

const Product: React.FC<ProductProps> = async ({
  params: { productId, storeId },
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          sizes={sizes}
          colors={colors}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default Product;
