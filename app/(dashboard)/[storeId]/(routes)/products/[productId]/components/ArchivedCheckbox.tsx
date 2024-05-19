"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface ArchivedCheckboxProps {
  text: string;
  field: ControllerRenderProps<
    {
      name: string;
      price: number;
      categoryId: string;
      sizeId: string;
      colorId: string;
      isArchived: boolean;
      isFeatured: boolean;
      images: any;
    },
    "isArchived"
  >;
}

export function ArchivedCheckbox({ text, field }: ArchivedCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.name}
        checked={field.value}
        onCheckedChange={field.onChange}
      />
      <FormDescription>{text}</FormDescription>
    </div>
  );
}
