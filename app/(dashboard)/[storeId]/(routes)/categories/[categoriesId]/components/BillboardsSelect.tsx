"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Billboards } from "@prisma/client";
import { ControllerRenderProps } from "react-hook-form";

interface BillboardsSelectProps {
  billboards: Billboards[];
  field: ControllerRenderProps<
    {
      name: string;
      billboardId: string;
    },
    "billboardId"
  >;
}

export function BillboardsSelect({ billboards, field }: BillboardsSelectProps) {
  return (
    <Select
      onValueChange={field.onChange}
      value={field.value}
      defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue
          placeholder="Select a billboard"
          defaultValue={field.value}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {billboards.map((billboard) => (
            <SelectItem key={billboard.id} value={billboard.id}>
              {billboard.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
