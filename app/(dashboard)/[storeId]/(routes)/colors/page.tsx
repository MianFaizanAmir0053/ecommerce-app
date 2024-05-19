import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import ColorClient from "./components/Client";
import { ColorColumns } from "./components/columns";

const colorsPage = async ({ params }: { params: { storeId: string } }) => {
  const data = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formatedData: ColorColumns[] = data.map((color) => {
    return {
      id: color.id,
      name: color.name,
      value: color.value,
      createdAt: format(color.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formatedData} />
      </div>
    </div>
  );
};

export default colorsPage;
