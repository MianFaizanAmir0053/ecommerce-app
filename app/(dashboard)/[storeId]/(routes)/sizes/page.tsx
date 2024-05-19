import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import SizeClient from "./components/Client";
import { SizeColumns } from "./components/columns";

const sizesPage = async ({ params }: { params: { storeId: string } }) => {
  const data = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formatedData: SizeColumns[] = data.map((Size) => {
    return {
      id: Size.id,
      name: Size.name,
      value: Size.value,
      createdAt: format(Size.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formatedData} />
      </div>
    </div>
  );
};

export default sizesPage;
