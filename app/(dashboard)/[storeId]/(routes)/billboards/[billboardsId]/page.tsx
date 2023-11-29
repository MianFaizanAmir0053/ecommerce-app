import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/BillboardForm";
import React from "react";

type BillboardboardProps = {
  params: {
    billboardsId: string;
  };
};

const Billboardboard: React.FC<BillboardboardProps> = async ({
  params: { billboardsId },
}) => {
  console.log(billboardsId);

  const billboard = await prismadb.billboards.findUnique({
    where: {
      id: billboardsId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default Billboardboard;
