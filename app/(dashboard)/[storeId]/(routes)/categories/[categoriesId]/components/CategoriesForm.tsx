"use client";

import AlertModal from "@/components/modals/AlertModal";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboards, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { BillboardsSelect } from "./BillboardsSelect";

interface CategoriesFormProps {
  initialData: Category | null;
  billboards: Billboards[];
}

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  billboardId: z.string().min(1, "Select a billboard"),
});

type CategoriesFormValues = z.infer<typeof formSchema>;

const CategoriesForm = ({ initialData, billboards }: CategoriesFormProps) => {
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit category." : "Create category.";
  const description = initialData ? "Edit a category." : "Add a new category.";
  const toastMessage = initialData ? "category updated." : "category created.";
  const action = initialData ? "Save changes" : "Create";

  const CategoriesForm = useForm<CategoriesFormValues>({
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: CategoriesFormValues) => {
    try {
      setLoading(true);
      // updates category
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/categories/${params.categoriesId}`,
          data
        );
        console.log(res.data);
        // creates category
      } else {
        console.log(params);
        const res = await axios.post(`/api/${params.storeId}/categories`, data);
        console.log(res.data);
      }
      router.refresh();
      toast.success(toastMessage);
      router.push(`/${params.storeId}/categories`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (data: CategoriesFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.delete(
          `/api/${params.storeId}/categories/${params.categoriesId}`
        );
      }
      router.refresh();
      toast.success("category delete successfully");
      router.push(`/${params.storeId}/categories`);
    } catch (error) {
      toast.error("Make sure to remove all categories from the category");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(CategoriesForm.getValues())}
        loading={Loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            disabled={Loading}
            onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...CategoriesForm}>
        <form
          onSubmit={CategoriesForm.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="name"
              control={CategoriesForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billboardId"
              control={CategoriesForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <BillboardsSelect field={field} billboards={billboards} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={Loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoriesForm;
