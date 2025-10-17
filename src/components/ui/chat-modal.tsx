'use client';

import {
  addToast,
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LuBotMessageSquare,
  LuBrain,
  LuCheck,
  LuChevronDown,
  LuFileText,
  LuGem,
  LuGlobe,
  LuPencil,
  LuRocket,
  LuSend,
  LuSparkles,
  LuUpload,
  LuX,
  LuZap,
} from 'react-icons/lu';
import { PiUser } from 'react-icons/pi';
import { SiGoogle, SiOpenai } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    type: 'lead' | 'audience';
    id: string | null;
    name: string;
    data?: any; // Lead or audience data for context
  };
}

interface AudienceData {
  id: number;
  name: string;
  description: string;
  filters: any;
  leadCount: number;
  createdAt: string;
  leads: {
    lead: {
      id: number;
      name: string;
      category: string;
      city: string;
      country: string;
      phone: string[];
      emails: string[];
      website: string;
      contactPerson: string;
    };
  }[];
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

export default function ChatModal({
  isOpen,
  onClose,
  context,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]); // GPT-5 Mini as default
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LANGUAGES[0],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [audienceLeads, setAudienceLeads] = useState<AudienceData | null>(null);
  const [isLoadingAudienceData, setIsLoadingAudienceData] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const fetchAudienceData = useCallback(async () => {
    if (!context.id) return;

    setIsLoadingAudienceData(true);
    try {
      const response = await fetch(`/api/audiences/${context.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audience data');
      }

      const result = await response.json();
      setAudienceLeads(result.data);
    } catch (error) {
      console.error('Error fetching audience data:', error);
      addToast({
        title: 'Error',
        description: 'Failed to fetch audience data',
        color: 'danger',
      });
    } finally {
      setIsLoadingAudienceData(false);
    }
  }, [context.id]);

  // Fetch audience data when modal opens for audience type
  useEffect(() => {
    if (isOpen && context.type === 'audience' && context.id) {
      fetchAudienceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, context.type, context.id]);

  const generateContextMessage = useCallback((): string => {
    if (context.type === 'lead' && context.data) {
      const lead = context.data;
      return `Hello! I'm here to help you with **${lead.name}**.

**Quick Overview:**
• **Category:** ${lead.category || 'Not specified'}
• **Location:** ${lead.city ? `${lead.city}${lead.country ? `, ${lead.country}` : ''}` : 'Not specified'}
• **Contact:** ${lead.phone?.length > 0 ? lead.phone[0] : 'No phone'} ${lead.emails?.length > 0 ? `• ${lead.emails[0]}` : ''}
• **Website:** ${lead.website || 'Not available'}

I can help you with:
• Lead analysis and insights
• Contact strategies
• Market research
• Business intelligence
• Follow-up recommendations

What would you like to know about this lead?`;
    } else if (context.type === 'audience') {
      if (isLoadingAudienceData) {
        return `Hello! I'm loading information about the **${context.name}** audience. Please wait while I fetch all the leads data...`;
      }

      if (audienceLeads) {
        return `Hello! I'm here to help you with the **${audienceLeads.name}** audience.

**Audience Details:**
• **Total Leads:** ${audienceLeads.leadCount} leads
• **Description:** ${audienceLeads.description || 'No description available'}
• **Created:** ${audienceLeads.createdAt ? new Date(audienceLeads.createdAt).toLocaleDateString() : 'Unknown'}

**Complete Lead Data Loaded:** I now have access to all ${audienceLeads.leadCount} leads in this audience with their complete contact information, locations, categories, and other details.

I can help you with:
• Audience analysis and segmentation
• Individual lead insights
• Campaign strategies and targeting
• Contact information analysis
• Geographic distribution analysis
• Industry/category breakdown
• Lead quality assessment
• Personalized outreach recommendations

What would you like to know about this audience or its leads?`;
      } else if (context.data) {
        // Fallback to context data if audience fetch failed
        const audience = context.data;
        return `Hello! I'm here to help you with the **${audience.name}** audience.

**Audience Details:**
• **Lead Count:** ${audience.leadCount || 0} leads
• **Description:** ${audience.description || 'No description available'}
• **Created:** ${audience.createdAt ? new Date(audience.createdAt).toLocaleDateString() : 'Unknown'}

I can help you with:
• Audience analysis and segmentation
• Campaign strategies
• Lead quality assessment
• Market insights
• Targeting recommendations

How can I assist you with this audience?`;
      }
    }

    return `Hello! I'm your AI assistant. I'm ready to help you with business insights, lead analysis, marketing strategies, and more.

**I can assist with:**
• Lead and customer analysis
• Market research and insights
• Business strategy recommendations
• Contact and outreach strategies
• Data interpretation

How can I help you today?`;
  }, [context, isLoadingAudienceData, audienceLeads]);

  // Initialize chat with context when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // For audience type, wait for data to load
      if (context.type === 'audience' && !isLoadingAudienceData) {
        const contextMessage = generateContextMessage();
        if (contextMessage) {
          setMessages([
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: contextMessage,
              timestamp: new Date(),
              model: selectedModel.id,
            },
          ]);
        }
      } else if (context.type === 'lead') {
        const contextMessage = generateContextMessage();
        if (contextMessage) {
          setMessages([
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: contextMessage,
              timestamp: new Date(),
              model: selectedModel.id,
            },
          ]);
        }
      }
    }
  }, [
    isOpen,
    messages.length,
    selectedModel.id,
    isLoadingAudienceData,
    audienceLeads,
    context.type,
    generateContextMessage,
  ]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          model: selectedModel.id,
          context: context,
          audienceLeads:
            context.type === 'audience' ? audienceLeads : undefined,
          uploadedFiles: uploadedFiles,
          language: selectedLanguage.code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        model: selectedModel.id,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
        model: selectedModel.id,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditingMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
    // Focus the edit input after state update
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 100);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editingContent.trim()) return;

    // Find the index of the message being edited
    const messageIndex = messages.findIndex(
      (msg) => msg.id === editingMessageId,
    );
    if (messageIndex === -1) return;

    // Update the message content
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: editingContent.trim(),
      timestamp: new Date(), // Update timestamp to show it was edited
    };

    // Remove all messages after the edited message (including AI responses)
    const messagesToKeep = updatedMessages.slice(0, messageIndex + 1);
    setMessages(messagesToKeep);

    // Clear edit state
    setEditingMessageId(null);
    setEditingContent('');

    // If the edited message was a user message, regenerate AI response
    if (updatedMessages[messageIndex].role === 'user') {
      await regenerateAIResponse(messagesToKeep);
    }
  };

  const regenerateAIResponse = async (messagesUpToEdit: Message[]) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesUpToEdit.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          model: selectedModel.id,
          context: context,
          audienceLeads:
            context.type === 'audience' ? audienceLeads : undefined,
          uploadedFiles: uploadedFiles,
          language: selectedLanguage.code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        model: selectedModel.id,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error regenerating response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content:
          'Sorry, I encountered an error while regenerating my response. Please try again.',
        timestamp: new Date(),
        model: selectedModel.id,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.shiftKey) {
        // Allow new line with Ctrl+Enter or Shift+Enter
        return;
      } else {
        // Save edit with Enter alone
        e.preventDefault();
        saveEditedMessage();
      }
    } else if (e.key === 'Escape') {
      // Cancel edit with Escape
      e.preventDefault();
      cancelEdit();
    }
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

      // Add a system message about the uploaded file
      const systemMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📄 **File uploaded successfully!**

**${uploadedFile.name}** (${(uploadedFile.size / 1024).toFixed(1)} KB)

The content of this ${uploadedFile.type.toUpperCase()} file has been added to my knowledge base and will be used as a guideline for our conversation. I can now reference this information when providing responses.

You can ask me questions about the content or ask me to follow the guidelines specified in the document.`,
        timestamp: new Date(),
        model: selectedModel.id,
      };

      setMessages((prev) => [...prev, systemMessage]);
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

    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `📄 **Guideline file removed**

The uploaded file has been removed from my knowledge base. I will no longer reference its content in our conversation.`,
      timestamp: new Date(),
      model: selectedModel.id,
    };

    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleClose = () => {
    // Clear chat history and uploaded files when modal is closed
    setMessages([]);
    setInputMessage('');
    setUploadedFiles([]);
    setAudienceLeads(null);
    setEditingMessageId(null);
    setEditingContent('');
    onClose();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleMainInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.shiftKey) {
        // Allow new line with Ctrl+Enter or Shift+Enter
        return;
      } else {
        // Send message with Enter alone
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between px-6 py-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <LuBotMessageSquare className="text-primary text-2xl" />
              <div>
                <h3 className="text-lg font-semibold">AI Chat Assistant</h3>
                <div className="flex items-center gap-2">
                  <p className="text-foreground-400 text-sm">
                    {context.type === 'lead' ? 'Lead' : 'Audience'}:{' '}
                    {context.name}
                  </p>
                  {isLoadingAudienceData && (
                    <div className="flex items-center gap-1">
                      <Spinner size="sm" />
                      <span className="text-foreground-400 text-xs">
                        Loading leads...
                      </span>
                    </div>
                  )}
                  {context.type === 'audience' && audienceLeads && (
                    <Chip size="sm" color="primary" variant="flat">
                      {audienceLeads.leadCount} leads loaded
                    </Chip>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="flex flex-col p-0">
          {/* Uploaded Files Section */}
          {uploadedFiles.length > 0 && (
            <div className="border-divider bg-default-50 border-b px-4 py-3">
              <div className="mb-2 flex items-center gap-2">
                <LuFileText className="text-default-600 text-sm" />
                <span className="text-default-700 text-sm font-medium">
                  Guidelines ({uploadedFiles.length})
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

          <div className="space-y-4 px-2 pt-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar
                  size="sm"
                  className={`shrink-0 ${
                    message.role === 'user' ? 'bg-primary' : 'bg-default-200'
                  }`}
                  icon={
                    message.role === 'user' ? (
                      <PiUser className="text-white" />
                    ) : (
                      selectedModel.icon
                    )
                  }
                />

                <Card
                  className={`w-full max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-default-100'
                  }`}
                  shadow="none"
                >
                  <CardBody className="px-4 py-3">
                    {editingMessageId === message.id ? (
                      // Edit mode
                      <div className="space-y-3">
                        <Textarea
                          ref={editInputRef}
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          onKeyDown={handleEditKeyPress}
                          variant="flat"
                          classNames={{
                            input: 'text-sm',
                            inputWrapper: 'min-h-[40px] py-2',
                          }}
                          minRows={2}
                          maxRows={10}
                          placeholder="Edit your message..."
                          color="primary"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="solid"
                            color="danger"
                            onPress={cancelEdit}
                            startContent={<LuX className="text-sm" />}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="solid"
                            color="default"
                            onPress={saveEditedMessage}
                            isDisabled={!editingContent.trim()}
                            startContent={<LuCheck className="text-sm" />}
                          >
                            Save & Regenerate
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <>
                        <div className="text-sm leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Custom styling for markdown elements
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-2 ml-4 list-disc space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-2 ml-4 list-decimal space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => <li>{children}</li>,
                              code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                  <code
                                    className={`rounded px-1.5 py-0.5 font-mono text-xs ${
                                      message.role === 'user'
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-default-200 text-default-800'
                                    }`}
                                  >
                                    {children}
                                  </code>
                                ) : (
                                  <pre
                                    className={`my-2 block overflow-x-auto rounded-lg p-3 font-mono text-xs ${
                                      message.role === 'user'
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-default-200 text-default-800'
                                    }`}
                                  >
                                    <code>{children}</code>
                                  </pre>
                                );
                              },
                              pre: ({ children }) => children, // Remove default pre styling since we handle it in code
                              blockquote: ({ children }) => (
                                <blockquote
                                  className={`my-2 border-l-4 pl-4 italic ${
                                    message.role === 'user'
                                      ? 'border-primary-foreground/40'
                                      : 'border-default-400'
                                  }`}
                                >
                                  {children}
                                </blockquote>
                              ),
                              h1: ({ children }) => (
                                <h1 className="mb-2 mt-1 text-lg font-bold">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="mb-2 mt-1 text-base font-bold">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="my-1 text-sm font-bold">
                                  {children}
                                </h3>
                              ),
                              h4: ({ children }) => (
                                <h4 className="my-1 text-sm font-semibold">
                                  {children}
                                </h4>
                              ),
                              h5: ({ children }) => (
                                <h5 className="my-1 text-xs font-semibold">
                                  {children}
                                </h5>
                              ),
                              h6: ({ children }) => (
                                <h6 className="my-1 text-xs font-medium">
                                  {children}
                                </h6>
                              ),
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`underline hover:no-underline ${
                                    message.role === 'user'
                                      ? 'text-primary-foreground hover:text-primary-foreground/80'
                                      : 'text-primary hover:text-primary/80'
                                  }`}
                                >
                                  {children}
                                </a>
                              ),
                              hr: () => (
                                <hr
                                  className={`my-3 ${
                                    message.role === 'user'
                                      ? 'border-primary-foreground/30'
                                      : 'border-default-300'
                                  }`}
                                />
                              ),
                              table: ({ children }) => (
                                <div className="my-2 overflow-x-auto">
                                  <table
                                    className={`min-w-full border-collapse border ${
                                      message.role === 'user'
                                        ? 'border-primary-foreground/30'
                                        : 'border-default-300'
                                    }`}
                                  >
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th
                                  className={`border p-2 text-left font-semibold ${
                                    message.role === 'user'
                                      ? 'border-primary-foreground/30 bg-primary-foreground/10'
                                      : 'border-default-300 bg-default-100'
                                  }`}
                                >
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td
                                  className={`border p-2 ${
                                    message.role === 'user'
                                      ? 'border-primary-foreground/30'
                                      : 'border-default-300'
                                  }`}
                                >
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`text-xs ${
                              message.role === 'user'
                                ? 'text-primary-foreground/70'
                                : 'text-foreground-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                          <div className="flex items-center gap-2">
                            {message.model && message.role === 'assistant' && (
                              <span className="text-foreground-500 text-xs">
                                {
                                  AI_MODELS.find((m) => m.id === message.model)
                                    ?.name
                                }
                              </span>
                            )}
                            {message.role === 'user' && !isLoading && (
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className={`opacity-60 hover:opacity-100 ${
                                  message.role === 'user'
                                    ? 'text-primary-foreground hover:bg-primary-foreground/20'
                                    : 'text-foreground-600 hover:bg-default-200'
                                }`}
                                onPress={() =>
                                  startEditingMessage(
                                    message.id,
                                    message.content,
                                  )
                                }
                              >
                                <LuPencil className="text-sm" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar
                  size="sm"
                  className="bg-default-200 shrink-0"
                  icon={selectedModel.icon}
                />
                <Card className="bg-default-100" shadow="none">
                  <CardBody className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span className="text-foreground-500 text-sm">
                        {selectedModel.name} is thinking...
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-1 align-bottom">
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              placeholder={`Ask ${selectedModel.name} anything about ${context.name}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleMainInputKeyPress}
              variant="bordered"
              classNames={{
                input: 'text-sm',
                inputWrapper: 'min-h-[40px] py-2',
              }}
              disabled={isLoading}
              minRows={1}
              maxRows={5}
              color="primary"
            />
            <Button
              isIconOnly
              color="primary"
              variant="solid"
              onPress={handleSendMessage}
              isDisabled={!inputMessage.trim() || isLoading}
              className="shrink-0"
            >
              <LuSend className="text-lg" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-1 p-1">
            <div className="text-default-500 text-xs">
              Press{' '}
              <kbd className="bg-default-100 rounded px-1 py-0.5 text-xs">
                Enter
              </kbd>{' '}
              to send •{' '}
              <kbd className="bg-default-100 rounded px-1 py-0.5 text-xs">
                Shift + Enter
              </kbd>{' '}
              for new line
            </div>
            <div className="text-foreground-400 text-end text-xs">
              Chat history will be cleared when you close this modal
            </div>
          </div>
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
                    startContent={<div className="shrink-0">{model.icon}</div>}
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
