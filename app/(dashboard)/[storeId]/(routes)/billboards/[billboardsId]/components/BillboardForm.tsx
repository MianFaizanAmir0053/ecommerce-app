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
import { Billboards } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface BillboardFormProps {
  initialData: Billboards | null;
}

const formSchema = z.object({
  label: z.string().min(1, "Billboard label is required"),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? "Edit billboard." : "Create billboard.";
  const description = initialData
    ? "Edit a billboard."
    : "Add a new billboard.";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const BillboardForm = useForm<BillboardFormValues>({
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardsId}`,
          data
        );
        console.log(res.data);
      } else {
        const res = await axios.post(`/api/${params.storeId}/billboards`, data);
        console.log(res.data);
      }
      router.refresh();
      toast.success(toastMessage);
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.delete(
          `/api/${params.storeId}/billboards/${params.billboardsId}`
        );
      }
      router.refresh();
      toast.success("Billboard delete successfully");
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("Make sure to remove all categories from the billboard");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(BillboardForm.getValues())}
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
      <Form {...BillboardForm}>
        <form
          onSubmit={BillboardForm.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          <FormField
            name="imageUrl"
            control={BillboardForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(value) => field.onChange(value)}
                    onRemove={() => field.onChange("")}
                    disabled={Loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="label"
              control={BillboardForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Billboard label"
                      {...field}
                    />
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

      {/* <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      /> */}
    </>
  );
};

export default BillboardForm;
