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
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  value: z.string().min(1, "Size value is required"),
  name: z.string().min(1, "Size name is required"),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm = ({ initialData }: SizeFormProps) => {
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? "Edit size." : "Create size.";
  const description = initialData ? "Edit a size." : "Add a new size.";
  const toastMessage = initialData ? "size updated." : "size created.";
  const action = initialData ? "Save changes" : "Create";

  const SizeForm = useForm<SizeFormValues>({
    defaultValues: initialData || {
      name: "",
      value: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizesId}`,
          data
        );
      } else {
        console.log("data", data);

        const res = await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      toast.success(toastMessage);
      router.push(`/${params.storeId}/sizes`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.delete(`/api/${params.storeId}/sizes/${params.sizesId}`);
      }
      router.refresh();
      toast.success("Size deleted successfully");
      router.push(`/${params.storeId}/sizes`);
    } catch (error) {
      toast.error("Make sure to remove all products from the size");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(SizeForm.getValues())}
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
      <Form {...SizeForm}>
        <form
          onSubmit={SizeForm.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="name"
              control={SizeForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="value"
              control={SizeForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Size value"
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

export default SizeForm;
