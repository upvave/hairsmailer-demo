'use client';

import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Tooltip,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { PiClipboard, PiEye, PiNotePencil } from 'react-icons/pi';

import { useFetch } from '@/hook/useFetch';

interface Email {
  id: number;
  subject: string;
  body: string;
  htmlContent?: string;
  textContent?: string;
  recipientEmail: string;
  leadName: string;
  leadCategory?: string;
  leadLocation?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  hardBounce?: boolean;
  softBounce?: boolean;
  complainedAt?: string;
  unsubscribedAt?: string;
  blockedAt?: string;
  invalidEmail?: boolean;
  errorMessage?: string;
  campaignName?: string;
  campaignId: number;
}

interface EmailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailId: number | null;
  campaignId: number;
  onEdit?: (email: Email) => void;
  isEmailEditable: boolean;
}

export default function EmailViewModal({
  isOpen,
  onClose,
  emailId,
  campaignId,
  onEdit,
  isEmailEditable,
}: EmailViewModalProps) {
  const [copiedContent, setCopiedContent] = useState<string | null>(null);

  const {
    data: emailData,
    fetchData,
    isLoading,
  } = useFetch<{
    data: Email;
  }>(`/api/campaigns/${campaignId}/emails/${emailId}`, {
    onSuccess: () => {
      // Additional success handling if needed
    },
    onError: (error) => {
      console.error('Error fetching email:', error);
    },
  });

  useEffect(() => {
    if (isOpen && emailId && campaignId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, emailId, campaignId]);

  const getStatusColor = (email: Email) => {
    if (email.invalidEmail || email.blockedAt) return 'danger';
    if (email.hardBounce || email.softBounce) return 'danger';
    if (email.errorMessage) return 'danger';
    if (email.unsubscribedAt) return 'secondary';
    if (email.complainedAt) return 'warning';
    if (email.deliveredAt) return 'success';
    return 'default'; // pending
  };

  const getEmailStatus = (email: Email): string => {
    if (email.invalidEmail) return 'Invalid Email';
    if (email.blockedAt) return 'Blocked';
    if (email.hardBounce) return 'Hard Bounce';
    if (email.softBounce) return 'Soft Bounce';
    if (email.errorMessage) return 'Failed';
    if (email.unsubscribedAt) return 'Unsubscribed';
    if (email.complainedAt) return 'Complained';
    if (email.deliveredAt) return 'Delivered';
    return 'Pending';
  };

  const handleCopyContent = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(type);
      setTimeout(() => setCopiedContent(null), 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  const handleEdit = () => {
    if (emailData?.data && onEdit) {
      onEdit(emailData.data);
      onClose();
    }
  };

  const email = emailData?.data;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="mr-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PiEye className="text-primary text-xl" />
            {isLoading ? (
              <div>
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="mt-2 h-5 w-20 rounded" />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  {email?.leadName && (
                    <h3 className="text-xl font-semibold">{email.leadName}</h3>
                  )}
                  {email && (
                    <Chip
                      color={getStatusColor(email)}
                      variant="flat"
                      size="sm"
                    >
                      {getEmailStatus(email)}
                    </Chip>
                  )}
                </div>
                {email?.recipientEmail && (
                  <p className="text-primary text-base">
                    {email.recipientEmail}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            {isEmailEditable && (
              <Button
                variant="flat"
                color="secondary"
                startContent={<PiNotePencil />}
                onPress={handleEdit}
                size="sm"
              >
                Edit Email
              </Button>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="gap-6 p-6">
          {/* Email Information Card */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Business Category
              </label>
              {isLoading ? (
                <Skeleton className="h-10 rounded" />
              ) : (
                <p className="mt-1 text-gray-900">
                  {email?.leadCategory || 'N/A'}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              {isLoading ? (
                <Skeleton className="h-10 rounded" />
              ) : (
                <p className="mt-1 text-gray-900">
                  {email?.leadLocation || 'N/A'}
                </p>
              )}
            </div>
          </div>

          {/* Email Status Info */}
          {(email?.deliveredAt ||
            email?.openedAt ||
            email?.clickedAt ||
            isLoading) && (
            <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Delivered At
                </label>
                {isLoading ? (
                  <Skeleton className="h-10 rounded" />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {email?.deliveredAt
                      ? new Date(email.deliveredAt).toLocaleString()
                      : 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Opened At
                </label>
                {isLoading ? (
                  <Skeleton className="h-10 rounded" />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {email?.openedAt
                      ? new Date(email.openedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Clicked At
                </label>
                {isLoading ? (
                  <Skeleton className="h-10 rounded" />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {email?.clickedAt
                      ? new Date(email.clickedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                )}
              </div>
            </div>
          )}
          {/* Subject */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Subject Line
              </label>
              {email?.subject && (
                <Tooltip
                  content={
                    copiedContent === 'subject' ? 'Copied!' : 'Copy subject'
                  }
                >
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleCopyContent(email.subject, 'subject')}
                  >
                    <PiClipboard className="text-sm" />
                  </Button>
                </Tooltip>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-10 rounded" />
            ) : (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="font-medium text-gray-900">
                  {email?.subject || 'N/A'}
                </p>
              </div>
            )}
          </div>

          {/* Body */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Email Body
              </label>
              {email?.body && (
                <Tooltip
                  content={copiedContent === 'body' ? 'Copied!' : 'Copy body'}
                >
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => handleCopyContent(email.body, 'body')}
                  >
                    <PiClipboard className="text-sm" />
                  </Button>
                </Tooltip>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-48 rounded" />
            ) : (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 font-sans text-gray-900">
                  {email?.body || 'N/A'}
                </pre>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
