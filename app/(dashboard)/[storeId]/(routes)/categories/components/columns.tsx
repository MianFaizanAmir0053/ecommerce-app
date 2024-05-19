"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type CategoriesColumns = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoriesColumns>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction rowId={row.original.id} />;
    },
  },
];
