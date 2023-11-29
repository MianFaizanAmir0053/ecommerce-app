"use client";

import { Check, Copy, Server } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Separator } from "./separator";

type ApiAlertProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  admin: "destructive",
  public: "secondary",
};

const ApiAlert: React.FC<ApiAlertProps> = ({ description, title, variant }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div>
      <Separator />
      <Alert className="my-4">
        <Server className="h-4 w-4" />
        <div className="flex space-x-2 text-sm items-center">
          <AlertTitle className="m-0">{title}</AlertTitle>
          <Badge variant={variantMap[variant]}>{variant}</Badge>
        </div>
        <AlertDescription className="flex pt-1 items-center justify-between">
          <code className="p-1 rounded font-semibold bg-muted">
            {description}
          </code>
          {!copied ? (
            <Copy
              className="hover:bg-muted h-6 p-1 transition-all rounded w-6 cursor-pointer"
              onClick={copy}
            />
          ) : (
            <Check
              className="h-6 p-1 bg-muted transition-all rounded w-6 cursor-pointer"
              onClick={copy}
            />
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ApiAlert;
