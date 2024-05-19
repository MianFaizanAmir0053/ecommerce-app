import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import BillboardClient from "./components/Client";
import { BillboardColumns } from "./components/columns";

const billboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const data = await prismadb.billboards.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formatedData: BillboardColumns[] = data.map((billboard) => {
    return {
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formatedData} />
      </div>
    </div>
  );
};

export default billboardsPage;
