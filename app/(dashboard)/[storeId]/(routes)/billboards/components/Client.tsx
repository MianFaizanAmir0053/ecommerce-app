"use client";

import { DataTable } from "@/components/table/data-table";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumns, columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface Props {
  data: BillboardColumns[];
}

const BillboardClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();
  console.log(data);

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards/new`);
          }}>
          <Plus className="mr-2 h-4 w-4" /> Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="APIs" description="API calls for Billboards" />
      <Separator />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  );
};

export default BillboardClient;
