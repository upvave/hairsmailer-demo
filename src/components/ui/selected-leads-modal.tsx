'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { X } from 'lucide-react';
import { FiUsers } from 'react-icons/fi';

interface SelectedLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeadIds: string[];
  selectedLeads: { id: string; name: string; category?: string }[];
  onRemoveLead: (leadId: string) => void;
  onClearAll: () => void;
  onCreateAudience: () => void;
}

export default function SelectedLeadsModal({
  isOpen,
  onClose,
  selectedLeadIds,
  selectedLeads,
  onRemoveLead,
  onClearAll,
  onCreateAudience,
}: SelectedLeadsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h4 className="text-primary-700 flex items-center gap-4 text-lg font-semibold">
            Selected Leads ({selectedLeadIds.length})
          </h4>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            {selectedLeadIds.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-foreground-500">No leads selected</p>
              </div>
            ) : (
              selectedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
                >
                  <div className="flex-1">
                    <h3 className="text-foreground-900 font-medium">
                      {lead.name}
                    </h3>
                    {lead.category && (
                      <p className="text-foreground-600 text-sm">
                        {lead.category}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="light"
                    size="sm"
                    color="danger"
                    isIconOnly
                    title={`Remove ${lead.name} from selection`}
                    onPress={() => onRemoveLead(lead.id)}
                  >
                    <X />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-foreground-600 text-sm">
                {selectedLeadIds.length} lead
                {selectedLeadIds.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button color="default" variant="flat" onPress={onClearAll}>
                Clear All
              </Button>
              <Button
                color="primary"
                variant="flat"
                onPress={() => {
                  onClose();
                  onCreateAudience();
                }}
                startContent={<FiUsers />}
              >
                Create Audience
              </Button>
              <Button color="default" variant="solid" onPress={onClose}>
                Close
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
