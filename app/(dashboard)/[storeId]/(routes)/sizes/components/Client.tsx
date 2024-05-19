"use client";

import { DataTable } from "@/components/table/data-table";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumns, columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface Props {
  data: SizeColumns[];
}

const SizeClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/sizes/new`);
          }}>
          <Plus className="mr-2 h-4 w-4" /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="APIs" description="API calls for sizes" />
      <Separator />
      <ApiList entityIdName="sizesId" entityName="sizes" />
    </>
  );
};

export default SizeClient;
