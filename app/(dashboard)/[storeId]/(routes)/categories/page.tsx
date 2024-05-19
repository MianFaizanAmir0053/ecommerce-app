import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { CategoriesColumns } from "./components/columns";
import CategoriesClient from "./components/Client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const data = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: CategoriesColumns[] = data.map((categories) => {
    return {
      id: categories.id,
      name: categories.name,
      createdAt: format(categories.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formatedData} />
      </div>
    </div>
  );
};

export default CategoriesPage;
