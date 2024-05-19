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
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ColorsFormProps {
  initialData: Color | null;
}

const formSchema = z.object({
  value: z.string().min(1, "color value is required"),
  name: z.string().min(1, "color name is required"),
});

type ColorsFormValues = z.infer<typeof formSchema>;

const ColorsForm = ({ initialData }: ColorsFormProps) => {
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? "Edit color." : "Create color.";
  const description = initialData ? "Edit a color." : "Add a new color.";
  const toastMessage = initialData ? "color updated." : "color created.";
  const action = initialData ? "Save changes" : "Create";

  const ColorsForm = useForm<ColorsFormValues>({
    defaultValues: initialData || {
      name: "",
      value: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ColorsFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/colors/${params.colorsId}`,
          data
        );
      } else {
        console.log("data", data);

        const res = await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      toast.success(toastMessage);
      router.push(`/${params.storeId}/colors`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (data: ColorsFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.delete(`/api/${params.storeId}/colors/${params.colorsId}`);
      }
      router.refresh();
      toast.success("color deleted successfully");
      router.push(`/${params.storeId}/colors`);
    } catch (error) {
      toast.error("Make sure to remove all products from the color");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(ColorsForm.getValues())}
        loading={Loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant={"destructive"}
            color={"icon"}
            disabled={Loading}
            onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...ColorsForm}>
        <form
          onSubmit={ColorsForm.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="name"
              control={ColorsForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="value"
              control={ColorsForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <div className="flex w-full space-x-2 items-center">
                    <FormControl>
                      <Input
                        disabled={Loading}
                        placeholder="color value"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center gap-x-2">
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </div>
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

export default ColorsForm;
