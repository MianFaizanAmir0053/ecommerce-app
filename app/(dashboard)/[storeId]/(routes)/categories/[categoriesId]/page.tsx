import prismadb from "@/lib/prismadb";
import React from "react";
import CategoriesForm from "./components/CategoriesForm";

type CategoriesFormProps = {
  params: {
    categoriesId: string;
    storeId: string;
  };
};

const Categories: React.FC<CategoriesFormProps> = async ({
  params: { categoriesId, storeId },
}) => {
  const categories = await prismadb.category.findUnique({
    where: {
      id: categoriesId,
    },
  });
  const billboards = await prismadb.billboards.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesForm billboards={billboards} initialData={categories} />
      </div>
    </div>
  );
};

export default Categories;
