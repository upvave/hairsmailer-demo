'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { PiWarning } from 'react-icons/pi';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  details?: Array<{ label: string; value: string | number }>;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  details,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="bg-warning-100 rounded-full p-2">
            <PiWarning className="text-warning-600 text-lg" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </ModalHeader>
        <ModalBody>
          <p className="text-foreground-600">{message}</p>

          {details && details.length > 0 && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <div className="space-y-2">
                {details.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {detail.label}:
                    </span>
                    <span className="text-sm text-gray-900">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            {cancelText}
          </Button>
          <Button color={confirmColor} onPress={handleConfirm}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
