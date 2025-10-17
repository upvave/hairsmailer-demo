'use client';

import {
  addToast,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';
import {
  LuChevronDown,
  LuFileText,
  LuGlobe,
  LuPlus,
  LuUpload,
} from 'react-icons/lu';

import AudienceSelector from '@/components/selectors/audience-selector';
import SenderSelector from '@/components/selectors/sender-selector';
import {
  AI_MODELS,
  AIModel,
  Language,
  LANGUAGES,
  UploadedFile,
} from '@/constants/ai-models';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
}: CreateCampaignModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    audienceId: '',
    senderId: '',
    context: '',
  });
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]); // GPT-5 Mini as default
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LANGUAGES[0],
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        addToast({
          title: 'File Upload Error',
          description: error.error || 'Failed to upload file',
          color: 'danger',
        });
        throw new Error(error.error || 'Failed to upload file');
      }

      const data = await response.json();
      const uploadedFile: UploadedFile = data.file;

      setUploadedFiles((prev) => [...prev, uploadedFile]);

      addToast({
        title: 'File Uploaded',
        description: `${uploadedFile.name} has been uploaded successfully`,
        color: 'success',
      });
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleCreateCampaign = async (processNow: boolean = false) => {
    if (!formData.name.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Campaign name is required',
        color: 'danger',
      });
      return;
    }

    if (!formData.audienceId) {
      addToast({
        title: 'Validation Error',
        description: 'Please select an audience',
        color: 'danger',
      });
      return;
    }

    const isCreatingState = processNow ? setIsProcessing : setIsCreating;
    isCreatingState(true);

    try {
      const payload = {
        name: formData.name.trim(),
        audienceId: parseInt(formData.audienceId),
        senderId: parseInt(formData.senderId),
        context: formData.context.trim(),
        model: selectedModel.id,
        language: selectedLanguage.code,
        uploadedFiles: uploadedFiles,
        processNow,
      };

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create campaign');
      }

      const res = await response.json();
      router.push(`/campaigns/${res.data.id}`);

      addToast({
        title: 'Success',
        description: processNow
          ? 'Campaign created and processing started!'
          : 'Campaign created successfully!',
        color: 'success',
      });
      onClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      addToast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create campaign',
        color: 'danger',
      });
    } finally {
      isCreatingState(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      audienceId: '',
      senderId: '',
      context: '',
    });
    setUploadedFiles([]);
    setSelectedModel(AI_MODELS[1]);
    setSelectedLanguage(LANGUAGES[0]);
    onClose();
  };

  const isFormValid =
    formData.name.trim() && formData.audienceId && formData.senderId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h4 className="text-primary-600 flex items-center gap-2 text-lg font-semibold">
            <LuPlus className="text-xl" />
            Create New Campaign
          </h4>
          <p className="text-default-500 text-sm font-normal">
            Set up a new marketing campaign with AI-powered content generation
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-3">
            {/* Campaign Name */}
            <Input
              placeholder="Enter campaign name"
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              variant="bordered"
              color="primary"
              isRequired
            />

            {/* Audience Selection */}
            <AudienceSelector
              value={formData.audienceId}
              onSelect={(audienceId) =>
                handleInputChange('audienceId', audienceId)
              }
              isRequired
            />

            {/* Sender Selection */}
            <SenderSelector
              value={formData.senderId}
              onSelect={(senderId) => handleInputChange('senderId', senderId)}
              isRequired
            />

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="border-divider bg-default-50 rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <LuFileText className="text-default-600 text-sm" />
                  <span className="text-default-700 text-sm font-medium">
                    Uploaded Files ({uploadedFiles.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <Chip
                      key={file.id}
                      variant="flat"
                      color="primary"
                      size="sm"
                      onClose={() => removeFile(file.id)}
                      startContent={<LuFileText className="text-xs" />}
                    >
                      {file.name}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Context */}
            <Textarea
              placeholder="Describe your campaign goals, target message, or any specific instructions for the AI..."
              label="Campaign Context"
              value={formData.context}
              onChange={(e) => handleInputChange('context', e.target.value)}
              variant="bordered"
              color="primary"
              size="md"
              minRows={8}
              maxRows={8}
              isRequired
            />

            {/* File Upload and Model Selection */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="flat"
                size="sm"
                startContent={<LuUpload className="text-sm" />}
                className="h-8"
                isLoading={isUploading}
                onPress={() => document.getElementById('file-upload')?.click()}
              >
                <span className="hidden sm:inline">Upload Document</span>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    endContent={<LuChevronDown className="text-sm" />}
                    className="h-8"
                  >
                    <div className="flex items-center gap-2">
                      {selectedModel.icon}
                      <span className="hidden sm:inline">
                        {selectedModel.name}
                      </span>
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
                  className="max-w-xs"
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

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    startContent={<LuGlobe className="text-sm" />}
                    className="h-8"
                  >
                    <span className="hidden sm:inline">
                      {selectedLanguage.flag} {selectedLanguage.name}
                    </span>
                    <span className="sm:hidden">{selectedLanguage.flag}</span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Language Selection"
                  selectionMode="single"
                  selectedKeys={[selectedLanguage.code]}
                  onSelectionChange={(keys) => {
                    const langCode = Array.from(keys)[0] as string;
                    const language = LANGUAGES.find((l) => l.code === langCode);
                    if (language) setSelectedLanguage(language);
                  }}
                >
                  {LANGUAGES.map((language) => (
                    <DropdownItem
                      key={language.code}
                      startContent={language.flag}
                    >
                      {language.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <Button
            color="default"
            variant="flat"
            onPress={handleClose}
            isDisabled={isCreating || isProcessing}
          >
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button
              color="primary"
              variant="flat"
              onPress={() => handleCreateCampaign(false)}
              isLoading={isCreating}
              isDisabled={!isFormValid || isProcessing}
            >
              Create & Process Later
            </Button>
            <Button
              color="primary"
              variant="solid"
              onPress={() => handleCreateCampaign(true)}
              isLoading={isProcessing}
              isDisabled={!isFormValid || isCreating}
            >
              Create & Process Now
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
