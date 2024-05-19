"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColumns = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumns>[] = [
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Is Paid",
    accessorKey: "isPaid",
  },
  {
    header: "Total Price",
    accessorKey: "totalPrice",
  },
  {
    header: "Products",
    accessorKey: "products",
  },
];
