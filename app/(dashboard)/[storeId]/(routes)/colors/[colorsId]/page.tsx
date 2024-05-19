import prismadb from "@/lib/prismadb";
import React from "react";
import ColorsForm from "./components/ColorsForm";

type ColorsProps = {
  params: {
    colorsId: string;
  };
};

const Colors: React.FC<ColorsProps> = async ({ params: { colorsId } }) => {
  const colors = await prismadb.color.findUnique({
    where: {
      id: colorsId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsForm initialData={colors} />
      </div>
    </div>
  );
};

export default Colors;
