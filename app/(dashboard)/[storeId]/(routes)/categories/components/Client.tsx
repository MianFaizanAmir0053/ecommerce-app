"use client";

import { DataTable } from "@/components/table/data-table";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoriesColumns, columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface Props {
  data: CategoriesColumns[];
}

const CategoriesClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/categories/new`);
          }}>
          <Plus className="mr-2 h-4 w-4" /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="APIs" description="API calls for categories" />
      <Separator />
      <ApiList entityIdName="categoriesId" entityName="categories" />
    </>
  );
};

export default CategoriesClient;
