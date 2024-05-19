import prismadb from "@/lib/prismadb";
import React from "react";
import SizeForm from "./components/SizeForm";

type SizeProps = {
  params: {
    sizesId: string;
  };
};

const Size: React.FC<SizeProps> = async ({ params: { sizesId } }) => {
  const size = await prismadb.size.findUnique({
    where: {
      id: sizesId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default Size;
