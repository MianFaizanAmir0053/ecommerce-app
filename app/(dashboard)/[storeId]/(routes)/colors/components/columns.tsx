"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type ColorColumns = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumns>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <div
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: row.original.value }}
          />
          {row.original.value}
        </div>
      );
    },
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

//  <div
//    className="w-9 h-8 rounded-full"
//    style={{ backgroundColor: field.value }}
//  />;
