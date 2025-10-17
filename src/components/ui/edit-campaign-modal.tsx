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
import { useEffect, useState } from 'react';
import {
  LuBrain,
  LuChevronDown,
  LuFileText,
  LuGem,
  LuGlobe,
  LuPenTool,
  LuRocket,
  LuSparkles,
  LuUpload,
  LuZap,
} from 'react-icons/lu';
import { SiGoogle, SiOpenai } from 'react-icons/si';

import AudienceSelector from '@/components/selectors/audience-selector';

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number;
  initialData?: {
    name: string;
    context: string;
    model: string;
    audienceId: number | null;
    language: string;
    uploadedFiles: any[];
  };
  onSave?: () => void;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface UploadedFile {
  id: string;
  name: string;
  content: string;
  type: 'txt' | 'docx' | 'pdf';
  size: number;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-5-mini-2025-08-07',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    description: 'Efficient GPT-5 for everyday tasks',
    icon: <LuSparkles className="text-lg" />,
    color: 'primary',
  },
  {
    id: 'gpt-5-2025-08-07',
    name: 'GPT-5',
    provider: 'OpenAI',
    description: 'Next generation model with advanced capabilities',
    icon: <SiOpenai className="text-lg" />,
    color: 'success',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable model for complex reasoning',
    icon: <SiOpenai className="text-lg" />,
    color: 'success',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Faster GPT-4 with latest knowledge',
    icon: <LuRocket className="text-lg" />,
    color: 'primary',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Optimized for real-time conversations',
    icon: <LuZap className="text-lg" />,
    color: 'warning',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Lightweight version for quick tasks',
    icon: <LuSparkles className="text-lg" />,
    color: 'secondary',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'Advanced reasoning and coding',
    icon: <LuBrain className="text-lg" />,
    color: 'default',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: "Google's most capable AI model",
    icon: <SiGoogle className="text-lg" />,
    color: 'danger',
  },
  {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    provider: 'Google',
    description: 'Fast and efficient Gemini model',
    icon: <LuGem className="text-lg" />,
    color: 'success',
  },
];

export default function EditCampaignModal({
  isOpen,
  onClose,
  campaignId,
  initialData,
  onSave,
}: EditCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    audienceId: '',
    context: '',
  });
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]); // GPT-5 Mini as default
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LANGUAGES[0],
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        audienceId: initialData.audienceId?.toString() || '',
        context: initialData.context || '',
      });

      // Set selected model
      const model = AI_MODELS.find((m) => m.id === initialData.model);
      if (model) setSelectedModel(model);

      // Set selected language
      const language = LANGUAGES.find((l) => l.code === initialData.language);
      if (language) setSelectedLanguage(language);

      // Set uploaded files
      if (initialData.uploadedFiles) {
        setUploadedFiles(initialData.uploadedFiles);
      }
    }
  }, [initialData, isOpen]);

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

  const handleSaveCampaign = async () => {
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

    setIsSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        audienceId: parseInt(formData.audienceId),
        context: formData.context.trim(),
        model: selectedModel.id,
        language: selectedLanguage.code,
        uploadedFiles: uploadedFiles,
      };

      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update campaign');
      }

      addToast({
        title: 'Success',
        description: 'Campaign updated successfully!',
        color: 'success',
      });

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error updating campaign:', error);
      addToast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update campaign',
        color: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.audienceId;

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
            <LuPenTool className="text-xl" />
            Edit Campaign
          </h4>
          <p className="text-default-500 text-sm font-normal">
            Update your campaign settings and AI configuration
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
                onPress={() =>
                  document.getElementById('edit-file-upload')?.click()
                }
              >
                <span className="hidden sm:inline">Upload Document</span>
              </Button>
              <input
                id="edit-file-upload"
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
            isDisabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            color="primary"
            variant="solid"
            onPress={handleSaveCampaign}
            isLoading={isSaving}
            isDisabled={!isFormValid}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
