"use client";

import { DataTable } from "@/components/table/data-table";
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { OrderColumns, columns } from "./columns";

interface Props {
  data: OrderColumns[];
}

const OrderClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
