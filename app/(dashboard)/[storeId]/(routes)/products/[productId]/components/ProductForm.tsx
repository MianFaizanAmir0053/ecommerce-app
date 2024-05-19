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
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Product, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ArchivedCheckbox } from "./ArchivedCheckbox";
import { CategoriesSelect } from "./CategoriesSelect";
import { ColorsSelect } from "./ColorsSelect";
import { FeaturedCheckbox } from "./FeaturedCheckbox";
import { SizesSelect } from "./SizesSelect";

interface ProductFormProps {
  initialData: Product | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const formSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  price: z.coerce.number().min(1, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  sizeId: z.string().min(1, "Size is required"),
  colorId: z.string().min(1, "Color is required"),
  isArchived: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  images: z.object({ url: z.string() }).array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm = ({
  initialData,
  categories,
  colors,
  sizes,
}: ProductFormProps) => {
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? "Edit Product." : "Create Product.";
  const description = initialData ? "Edit a Product." : "Add a new Product.";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const ProductForm = useForm<ProductFormValues>({
    defaultValues: initialData
      ? { ...initialData, price: +initialData.price }
      : {
          name: "",
          categoryId: "",
          sizeId: "",
          colorId: "",
          price: 0,
          isArchived: false,
          isFeatured: false,
          images: [],
        },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        const res = await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      toast.success(toastMessage);
      router.push(`/${params.storeId}/products`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.delete(
          `/api/${params.storeId}/products/${params.productId}`
        );
      }
      router.refresh();
      toast.success("Product deleted successfully");
      router.push(`/${params.storeId}/products`);
    } catch (error) {
      toast.error("Error Occured!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(ProductForm.getValues())}
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
      <Form {...ProductForm}>
        <form
          onSubmit={ProductForm.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="name"
              control={ProductForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-full">
              <FormField
                name="images"
                control={ProductForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value.map((image) => image.url)}
                        onChange={(url) =>
                          field.onChange([...field.value, { url }])
                        }
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                        disabled={Loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="price"
              control={ProductForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="($) Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={ProductForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cateogory</FormLabel>
                  <FormControl>
                    <CategoriesSelect
                      category={categories}
                      field={field}
                      key={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8 items-center">
            <FormField
              name="sizeId"
              control={ProductForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <SizesSelect
                      sizes={sizes}
                      field={field}
                      key={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="colorId"
              control={ProductForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorsSelect
                      colors={colors}
                      field={field}
                      key={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <label className="border rounded p-2 h-full w-full cursor-pointer">
              <FormField
                name="isArchived"
                control={ProductForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Archived</FormLabel>
                    <FormControl>
                      <ArchivedCheckbox
                        field={field}
                        text="This product will not show anywhere in the store"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </label>
            <label className="border rounded p-2 h-full w-full cursor-pointer">
              <FormField
                name="isFeatured"
                control={ProductForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured</FormLabel>
                    <FormControl>
                      <FeaturedCheckbox
                        field={field}
                        text="This product will appear on home page"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </label>
          </div>
          <Button disabled={Loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
