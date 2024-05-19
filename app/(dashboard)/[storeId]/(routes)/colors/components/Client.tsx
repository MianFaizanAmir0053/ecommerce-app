"use client";

import { DataTable } from "@/components/table/data-table";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumns, columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface Props {
  data: ColorColumns[];
}

const ColorClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/colors/new`);
          }}>
          <Plus className="mr-2 h-4 w-4" /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="APIs" description="API calls for colors" />
      <Separator />
      <ApiList entityIdName="colorsId" entityName="colors" />
    </>
  );
};

export default ColorClient;
