'use client';

import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useState } from 'react';

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailContent?: {
    id: number;
    subject: string;
    body: string;
    htmlContent?: string;
    textContent?: string;
  } | null;
}

export default function TestEmailModal({
  isOpen,
  onClose,
  emailContent,
}: TestEmailModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendTest = async () => {
    if (!email.trim()) {
      addToast({
        color: 'danger',
        title: 'Email required',
        description: 'Please enter an email address.',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast({
        color: 'danger',
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;
      let successMessage;

      if (emailContent) {
        // Send test email using database template (new simplified API)
        response = await fetch('/api/service/email/send/template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailId: emailContent.id,
            to: email,
          }),
        });
        successMessage = `Test email with campaign content sent to ${email}`;
      } else {
        // Send general test email
        response = await fetch('/api/service/email/send/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ to: email }),
        });
        successMessage = `Test email has been sent to ${email}`;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        addToast({
          color: 'success',
          title: 'Test email sent!',
          description: successMessage,
        });
        setEmail('');
        onClose();
      } else {
        throw new Error(result.error || 'Failed to send test email');
      }
    } catch (error: any) {
      addToast({
        color: 'danger',
        title: 'Failed to send test email',
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">
            {emailContent ? 'Send Campaign Email Test' : 'Send Test Email'}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {emailContent && (
              <div className="rounded-lg bg-blue-50 p-3">
                <h4 className="text-sm font-medium text-blue-900">
                  Email Preview
                </h4>
                <p className="mt-1 text-xs text-blue-700">
                  <strong>Subject:</strong> {emailContent.subject}
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  This will send the actual campaign email content to your test
                  address.
                </p>
              </div>
            )}
            <div>
              <p className="mb-3 text-justify text-sm text-gray-600">
                {emailContent
                  ? 'Send this specific campaign email to a test address to preview how it will look to recipients.'
                  : 'Send a test email to verify that the email service is working correctly. Preview the email in your inbox to confirm everything looks good.'}
              </p>
              <Input
                label="Email Address"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                variant="bordered"
                isDisabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendTest();
                  }
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSendTest}
            isLoading={isLoading}
          >
            Send Test Email
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
