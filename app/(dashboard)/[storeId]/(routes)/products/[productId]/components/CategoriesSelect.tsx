"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";
import { ControllerRenderProps } from "react-hook-form";

interface categoriesSelectProps {
  category: Category[];
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
    "categoryId"
  >;
  key: string | undefined;
}

export function CategoriesSelect({ category, field }: categoriesSelectProps) {
  return (
    <Select
      onValueChange={field.onChange}
      value={field.value}
      defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue
          placeholder="Select a category"
          defaultValue={field.value}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {category.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
