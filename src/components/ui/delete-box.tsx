import {
  addToast,
  Button,
  ButtonProps,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { PiTrash } from 'react-icons/pi';

export default function DeleteBox({
  children,
  title,
  onConfirm,
  onCancel,
  isDisabled,
  warning,
  confirmText,
  DeleteMessage,
  buttonProps,
  buttonText,
  buttonIcon,
}: {
  children?: React.ReactNode;
  title?: string;
  onConfirm?: () => Promise<string | void>;
  onCancel?: () => Promise<void>;
  isDisabled?: boolean;
  warning?: string;
  confirmText?: string;
  DeleteMessage?: string;
  buttonProps?: Partial<ButtonProps>;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!open) {
      setInput('');
    }
  }, [open]);

  const onConfirmClick = async () => {
    if (confirmText && input !== confirmText) return;
    setLoading(true);
    const error = await onConfirm?.();
    if (error) {
      addToast({
        title: 'Error',
        description: error,
        color: 'danger',
      });
      setLoading(false);
      return;
    }
    setInput('');
    setOpen(false);
    setLoading(false);
    if (DeleteMessage) {
      addToast({
        title: 'Success',
        description: DeleteMessage,
        color: 'success',
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInput('');
    onCancel?.();
  };
  return (
    <>
      <Tooltip content={`Delete ${title || 'item'}`}>
        <Button
          variant="light"
          size="sm"
          color="danger"
          isIconOnly={!buttonText}
          title={`Delete ${title || 'item'}`}
          isDisabled={isDisabled}
          onPress={() => setOpen(true)}
          {...(buttonProps as any)}
        >
          {children || (
            <>
              {buttonIcon || <PiTrash className="text-xl" />} {buttonText || ''}
            </>
          )}
        </Button>
      </Tooltip>
      <Modal
        isOpen={open}
        onClose={handleClose}
        size="md"
        isDismissable={!loading}
        isKeyboardDismissDisabled={loading}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h4 className="text-danger-600 flex items-center gap-2 text-lg font-semibold">
              Confirm Delete
            </h4>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <p className="text-foreground-700 text-justify">
                {warning ||
                  `Are you sure you want to delete this ${title || 'item'}?`}
              </p>
              <p className="text-foreground-500 text-sm">
                This action cannot be undone. The item will be permanently
                removed from the system.
              </p>
              {confirmText && (
                <div className="flex flex-col gap-2">
                  <p className="text-foreground-700 text-sm font-medium">
                    To confirm this action, please type{' '}
                    <span className="text-danger-600 font-mono font-bold">
                      {confirmText}
                    </span>{' '}
                    in the box below:
                  </p>
                  <Input
                    value={input}
                    onValueChange={setInput}
                    placeholder={`Type "${confirmText}" to confirm`}
                    variant="bordered"
                    color={input === confirmText ? 'success' : 'default'}
                    isDisabled={loading}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={handleClose}
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              variant="solid"
              onPress={onConfirmClick}
              isLoading={loading}
              isDisabled={confirmText ? input !== confirmText : false}
            >
              Delete {title || 'Item'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
