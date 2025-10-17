'use client';

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Textarea,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { LuChevronDown, LuSave, LuSparkles, LuWand } from 'react-icons/lu';
import { PiMagicWand, PiNotePencil } from 'react-icons/pi';

import { AI_MODELS, AIModel } from '@/constants/ai-models';
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

interface EmailEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: Email | null;
  onSave?: (updatedEmail: Partial<Email>) => void;
}

const ENHANCEMENT_PROMPTS = [
  {
    id: 'improve-tone',
    title: 'Improve Tone',
    description: 'Make the email more professional and engaging',
    prompt:
      'Improve the tone of this email to be more professional, engaging, and persuasive while maintaining the core message.',
  },
  {
    id: 'make-shorter',
    title: 'Make Shorter',
    description: 'Condense the email while keeping key points',
    prompt:
      'Make this email more concise and to the point while preserving all important information and maintaining a professional tone.',
  },
  {
    id: 'add-urgency',
    title: 'Add Urgency',
    description: 'Create a sense of urgency without being pushy',
    prompt:
      'Add a sense of appropriate urgency to this email to encourage prompt action while maintaining professionalism.',
  },
  {
    id: 'personalize',
    title: 'Personalize More',
    description: 'Make it more personalized for the recipient',
    prompt:
      'Make this email more personalized and tailored to the specific recipient, incorporating relevant details about their business or industry.',
  },
  {
    id: 'add-benefits',
    title: 'Highlight Benefits',
    description: 'Emphasize the value proposition',
    prompt:
      'Enhance this email by highlighting the key benefits and value proposition more clearly and compellingly.',
  },
  {
    id: 'call-to-action',
    title: 'Stronger CTA',
    description: 'Improve the call-to-action',
    prompt:
      'Improve the call-to-action in this email to be more compelling and specific, making it clear what the recipient should do next.',
  },
];

export default function EmailEditModal({
  isOpen,
  onClose,
  email,
  onSave,
}: EmailEditModalProps) {
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]); // GPT-5 Mini as default
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch hook for saving email
  const { fetchData: saveEmail, isLoading: isSaving } = useFetch<{
    success: boolean;
    message: string;
  }>(`/api/campaigns/${email?.campaignId}/emails/${email?.id}`, {
    method: 'PUT',
    onSuccess: (result) => {
      if (result.success) {
        addToast({
          color: 'success',
          title: 'Email updated successfully',
          description: 'Your changes have been saved.',
        });
        setHasUnsavedChanges(false);
        onSave?.({
          subject: editedSubject,
          body: editedBody,
        });
      }
    },
    onError: (error) => {
      addToast({
        color: 'danger',
        title: 'Failed to save email',
        description: error || 'Please try again later.',
      });
    },
  });

  // Fetch hook for AI enhancement
  const { fetchData: enhanceWithAI } = useFetch<{
    subject: string;
    body: string;
  }>('/api/ai/enhance-email', {
    method: 'POST',
    onSuccess: (result) => {
      setEditedSubject(result.subject);
      setEditedBody(result.body);
      setHasUnsavedChanges(true);
      setIsEnhancing(false);
    },
    onError: (error) => {
      setIsEnhancing(false);
      addToast({
        color: 'danger',
        title: 'Failed to enhance email',
        description: error || 'Please try again later.',
      });
    },
  });

  useEffect(() => {
    if (email && isOpen) {
      setEditedSubject(email.subject);
      setEditedBody(email.body);
      setHasUnsavedChanges(false);
      setCustomPrompt('');
    }
  }, [email, isOpen]);

  const handleSubjectChange = (value: string) => {
    setEditedSubject(value);
    setHasUnsavedChanges(true);
  };

  const handleBodyChange = (value: string) => {
    setEditedBody(value);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!email) return;

    saveEmail({
      body: {
        subject: editedSubject,
        body: editedBody,
      },
    });
  };

  const handleEnhanceWithPrompt = (prompt: string) => {
    if (!email || !prompt.trim()) return;

    setIsEnhancing(true);
    enhanceWithAI({
      body: {
        subject: editedSubject,
        body: editedBody,
        prompt: prompt,
        model: selectedModel.id,
        leadName: email.leadName,
        leadCategory: email.leadCategory,
        leadLocation: email.leadLocation,
        recipientEmail: email.recipientEmail,
      },
    });
  };

  const handleCustomEnhancement = () => {
    if (!customPrompt.trim()) {
      addToast({
        color: 'warning',
        title: 'Please enter a prompt',
        description: 'Describe how you want to enhance the email.',
      });
      return;
    }

    handleEnhanceWithPrompt(customPrompt);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = confirm(
        'You have unsaved changes. Are you sure you want to close?',
      );
      if (!confirmClose) return;
    }
    setHasUnsavedChanges(false);
    onClose();
  };

  if (!email) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PiNotePencil className="text-primary text-xl" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{email.leadName}</h3>
                {hasUnsavedChanges && (
                  <Chip color="warning" variant="flat" size="sm">
                    Unsaved Changes
                  </Chip>
                )}
              </div>
              <p className="text-sm text-gray-600">
                To: ({email.recipientEmail})
              </p>
            </div>
          </div>
          <div className="mr-2 flex gap-2">
            <Button
              color="primary"
              variant="flat"
              size="sm"
              startContent={<LuSave />}
              onPress={handleSave}
              isLoading={isSaving}
              isDisabled={!hasUnsavedChanges || isEnhancing}
            >
              Save Changes
            </Button>
          </div>
        </ModalHeader>

        <ModalBody className="gap-6 p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Email Content */}
            <div className="space-y-6 lg:col-span-2">
              <Input
                value={editedSubject}
                label="Email Subject"
                onChange={(e) => handleSubjectChange(e.target.value)}
                placeholder="Enter email subject"
                variant="bordered"
                color="primary"
                size="lg"
                classNames={{
                  input: 'text-base font-medium',
                }}
              />

              <Textarea
                value={editedBody}
                onChange={(e) => handleBodyChange(e.target.value)}
                placeholder="Enter email content"
                label="Email Body"
                variant="bordered"
                color="primary"
                minRows={10}
                maxRows={20}
                classNames={{
                  input: 'text-base leading-relaxed',
                }}
              />
            </div>

            <Card shadow="none" className="border-1">
              <CardHeader className="pb-3">
                <div className="text-primary flex items-center gap-2">
                  <PiMagicWand className="text-lg" />
                  <h4 className="text-lg font-semibold">AI Enhancement</h4>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* AI Model Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    AI Model
                  </label>
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        endContent={<LuChevronDown className="text-sm" />}
                        className="w-full justify-between"
                        size="sm"
                      >
                        <div className="flex items-center gap-2">
                          {selectedModel.icon}
                          <span>{selectedModel.name}</span>
                        </div>
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="AI Model Selection"
                      selectionMode="single"
                      selectedKeys={[selectedModel.id]}
                      onSelectionChange={(keys) => {
                        const modelId = Array.from(keys)[0] as string;
                        const model = AI_MODELS.find((m) => m.id === modelId);
                        if (model) setSelectedModel(model);
                      }}
                      className="w-72"
                    >
                      {AI_MODELS.map((model) => (
                        <DropdownItem
                          key={model.id}
                          description={model.description}
                          startContent={model.icon}
                          className="py-3"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{model.name}</span>
                              <span className="text-foreground-400 text-xs">
                                {model.provider}
                              </span>
                            </div>
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* Quick Enhancement Options */}
                <div>
                  <label className="mb-3 block text-sm font-medium">
                    Quick Enhancements
                  </label>
                  <div className="space-y-2">
                    {ENHANCEMENT_PROMPTS.map((prompt) => (
                      <Button
                        key={prompt.id}
                        variant="flat"
                        size="sm"
                        className="w-full justify-start"
                        startContent={<LuSparkles className="text-sm" />}
                        onPress={() => handleEnhanceWithPrompt(prompt.prompt)}
                        isDisabled={isEnhancing}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{prompt.title}</span>
                          <span className="text-xs text-gray-500">
                            {prompt.description}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Custom Enhancement
                  </label>
                  <div className="space-y-2">
                    <Textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe how you want to enhance the email..."
                      variant="bordered"
                      minRows={3}
                      maxRows={5}
                      size="sm"
                    />
                    <Button
                      color="primary"
                      size="sm"
                      className="w-full"
                      startContent={<LuWand className="text-sm" />}
                      onPress={handleCustomEnhancement}
                      isDisabled={isEnhancing || !customPrompt.trim()}
                    >
                      Enhance with Custom Prompt
                    </Button>
                  </div>
                </div>

                {/* Enhancement Status */}
                {isEnhancing && (
                  <div className="bg-primary-50 flex items-center gap-2 rounded-lg p-3">
                    <Spinner size="sm" color="primary" />
                    <span className="text-primary text-sm font-medium">
                      {selectedModel.name} is enhancing your email...
                    </span>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
