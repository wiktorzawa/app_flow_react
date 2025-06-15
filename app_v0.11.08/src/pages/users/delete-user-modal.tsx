import { Button, Modal, ModalHeader, ModalBody } from "flowbite-react";
import { usunPracownika } from "../../api/login_table_staff.api";
import { useState } from "react";

export type DeleteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pracownikId: string | null;
  onSuccess: () => void;
};

export function DeleteUserModal({ isOpen, onClose, pracownikId, onSuccess }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!pracownikId) return;
    try {
      setIsDeleting(true);
      await usunPracownika(pracownikId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Błąd podczas usuwania pracownika:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Czy na pewno chcesz usunąć tego pracownika?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Usuwanie..." : "Tak, usuń"}
            </Button>
            <Button color="gray" onClick={onClose}>
              Nie, anuluj
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
