import { FC } from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  loading: boolean;
  onClose: () => void;
}

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  onClose,
  loading,
  onConfirm,
}) => {
  return (
    <Modal
      description="This action cannot be undone."
      isOpen={isOpen}
      title="Are you sure?"
      onClose={onClose}>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={onClose}
          disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant={"destructive"} disabled={loading}>
          {loading ? "Loading..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
