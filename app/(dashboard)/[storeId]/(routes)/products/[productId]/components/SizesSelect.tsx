"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Size } from "@prisma/client";
import { ControllerRenderProps } from "react-hook-form";

interface SizesSelectProps {
  sizes: Size[];
  field: ControllerRenderProps<
    {
      name: string;
      categoryId: string;
      price: number;
      sizeId: string;
      colorId: string;
      isArchived: boolean;
      isFeatured: boolean;
      images: any;
    },
    "sizeId"
  >;
  key: string | undefined;
}

export function SizesSelect({ sizes, field }: SizesSelectProps) {
  return (
    <Select
      onValueChange={field.onChange}
      value={field.value}
      defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue placeholder="Select a size" defaultValue={field.value} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sizes.map((size) => (
            <SelectItem key={size.id} value={size.id}>
              {size.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
