import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import ProductClient from "./components/Client";
import { ProductColumns } from "./components/columns";
import { formatPrice } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const data = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      size: true,
      color: true,
      category: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formatedData: ProductColumns[] = data.map((Product) => {
    return {
      id: Product.id,
      name: Product.name,
      isArchived: Product.isArchived,
      isFeatured: Product.isFeatured,
      price: formatPrice(+Product.price),
      category: Product.category.name,
      size: Product.size.name,
      color: Product.color.value,
      createdAt: format(Product.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatedData} />
      </div>
    </div>
  );
};

export default ProductsPage;
