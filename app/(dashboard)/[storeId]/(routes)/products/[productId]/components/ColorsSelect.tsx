"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Color } from "@prisma/client";
import { ControllerRenderProps } from "react-hook-form";

interface ColorsSelectProps {
  colors: Color[];
  field: ControllerRenderProps<
    {
      name: string;
      categoryId: string;
      price: number;
      sizeId: string;
      isArchived: boolean;
      isFeatured: boolean;
      colorId: string;
      images: any;
    },
    "colorId"
  >;
  key: string | undefined;
}

export function ColorsSelect({ colors, field }: ColorsSelectProps) {
  return (
    <Select
      onValueChange={field.onChange}
      value={field.value}
      defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue placeholder="Select a color" defaultValue={field.value} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {colors.map((color) => (
            <SelectItem key={color.id} value={color.id}>
              <div className="flex gap-x-2">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
