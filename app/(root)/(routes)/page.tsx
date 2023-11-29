"use client";

// This component is only used to open the modal on the first visit to the app repeatedly.

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
  const isOpen = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);

  useEffect(() => {
    if (!isOpen) onOpen();
    console.log("SetupPage", isOpen);
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
