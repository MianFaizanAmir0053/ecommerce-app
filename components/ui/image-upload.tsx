"use client";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { CldUploadWidget } from "next-cloudinary";

type Props = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};

const ImageUpload = ({ onChange, onRemove, value, disabled }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="flex mb-4 items-center gap-4">
        {value?.map(
          (url: any) =>
            value && (
              <div
                key={url}
                className="relative w-[200px] h-[200px] overflow-hidden rounded-md">
                <div className="z-10 absolute top-2 right-2">
                  <Button
                    variant="destructive"
                    type="button"
                    size="icon"
                    onClick={() => onRemove(url)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                <Image fill src={url} alt="Image" className="object-cover" />
              </div>
            )
        )}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="ambvfe8s">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              variant="secondary"
              type="button"
              size="sm"
              onClick={onClick}
              disabled={disabled}>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
