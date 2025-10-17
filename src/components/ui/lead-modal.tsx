'use client';

import {
  addToast,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
  Textarea,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { MdEmail, MdPhone, MdWeb } from 'react-icons/md';
import { PiEye, PiNotePencil } from 'react-icons/pi';

interface Lead {
  id: number;
  name: string;
  category?: string;
  phone: string[];
  emails: string[];
  location?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  contactPerson?: string;
  branchCount?: number;
  foundationYear?: number;
  employeeDetail?: any;
  trainsApprentices?: boolean;
  servicesOffered: string[];
  specializations: string[];
  priceCategories: string[];
  positiveReviews: string[];
  negativeReviews: string[];
  specialFeatures: string[];
  priceRange?: string;
  atmosphere?: string;
  openingHours?: any;
  bookingSituation?: string;
  description?: string;
  mediaAssets: string[];
  teamInfo?: any;
  website?: string;
  sources: string[];
  sourceIds?: any;
  contactFirstName?: string;
  contactLastName?: string;
  contactProfession?: string;
  socialMediaHandles?: any;
  seoKeywords: string[];
  tags: string[];
  promotionalOffers: string[];
  estimatedRevenue?: string;
  targetAudience: string[];
  popularServices: string[];
  reviews_average?: string;
  reviews_count?: string;
  scrapedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadModalProps {
  leadId: string | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'create';
  onSave?: () => void;
}

export default function LeadModal({
  leadId,
  isOpen,
  onClose,
  mode,
  onSave,
}: LeadModalProps) {
  const [isEditMode, setIsEditMode] = useState(
    mode === 'edit' || mode === 'create',
  );
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'create') {
      // Initialize with default values for new lead
      setFormData({
        name: '',
        phone: [],
        emails: [],
        servicesOffered: [],
        specializations: [],
        priceCategories: [],
        positiveReviews: [],
        negativeReviews: [],
        reviews_average: '',
        reviews_count: '',
        specialFeatures: [],
        mediaAssets: [],
        sources: ['manual-add'],
        seoKeywords: [],
        tags: [],
        promotionalOffers: [],
        targetAudience: [],
        popularServices: [],
      });
    } else if (leadId && isOpen) {
      // Fetch existing lead data
      fetch(`/api/leads/${leadId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setFormData(data.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching lead:', error);
          addToast({
            color: 'danger',
            title: 'Failed to fetch lead details',
            timeout: 3000,
          });
        });
    }
  }, [leadId, isOpen, mode]);

  useEffect(() => {
    setIsEditMode(mode === 'edit' || mode === 'create');
  }, [mode]);

  const handleSave = async () => {
    if (!formData.name) {
      addToast({
        color: 'danger',
        title: 'Lead name is required',
        timeout: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const url = mode === 'create' ? '/api/leads' : `/api/leads/${leadId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Failed to ${mode === 'create' ? 'create' : 'update'} lead`,
        );
      }

      addToast({
        color: 'success',
        title:
          result.message ||
          `Lead ${mode === 'create' ? 'created' : 'updated'} successfully`,
        timeout: 3000,
      });

      if (mode === 'create') {
        handleClose(); // Close the modal after creating
      } else {
        setIsEditMode(false);
      }
      onSave?.();
    } catch (error: any) {
      console.error(
        `Error ${mode === 'create' ? 'creating' : 'updating'} lead:`,
        error,
      );
      addToast({
        color: 'danger',
        title:
          error.message ||
          `Failed to ${mode === 'create' ? 'create' : 'update'} lead`,
        timeout: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Lead, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field: keyof Lead, value: string) => {
    const array = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const addArrayItem = (field: keyof Lead, value: string = '') => {
    const inputValue = value.trim();
    if (!inputValue && value !== '') return;

    setFormData((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      return {
        ...prev,
        [field]: [...currentArray, inputValue || ''],
      };
    });
  };

  const removeArrayItem = (field: keyof Lead, index: number) => {
    setFormData((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      return {
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index),
      };
    });
  };

  const updateArrayItem = (field: keyof Lead, index: number, value: string) => {
    setFormData((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = [...currentArray];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleClose = () => {
    setIsEditMode(mode === 'edit' || mode === 'create');
    setFormData({});
    onClose();
  };

  if (!formData.name && !isOpen && mode !== 'create') {
    return null;
  }

  const lead = formData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <PiNotePencil className="text-primary text-xl" />
            ) : (
              <PiEye className="text-primary text-xl" />
            )}
            <h3 className="text-xl font-semibold">
              {mode === 'create'
                ? 'Create New Lead'
                : isEditMode
                  ? 'Edit Lead'
                  : 'Lead Details'}
            </h3>
          </div>
          <div className="mr-5 flex items-center gap-2">
            {mode === 'view' && (
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={toggleEditMode}
                startContent={<PiNotePencil />}
              >
                {isEditMode ? 'Cancel Edit' : 'Edit'}
              </Button>
            )}
            {(isEditMode || mode === 'create') && (
              <Button
                size="sm"
                color="primary"
                onPress={handleSave}
                isLoading={loading}
                isDisabled={!lead.name}
              >
                {mode === 'create' ? 'Create Lead' : 'Save Changes'}
              </Button>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Lead Name"
                value={lead.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                isRequired
              />
              <Input
                label="Category"
                value={lead.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Website"
                value={lead.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                startContent={<MdWeb className="text-gray-400" />}
              />
              <Input
                label="Price Range"
                value={lead.priceRange || ''}
                onChange={(e) =>
                  handleInputChange('priceRange', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
            </div>
            <Textarea
              label="Description"
              value={lead.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              isReadOnly={!isEditMode}
              variant={isEditMode ? 'bordered' : 'flat'}
              rows={3}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Contact Information
            </h4>

            {/* Phone Numbers */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Numbers</label>
              {isEditMode ? (
                <div className="space-y-2">
                  {(lead.phone || []).map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) =>
                          updateArrayItem('phone', index, e.target.value)
                        }
                        startContent={<MdPhone className="text-gray-400" />}
                        placeholder="Enter phone number"
                      />
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => removeArrayItem('phone', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new phone number"
                      startContent={<MdPhone className="text-gray-400" />}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          if (value.trim()) {
                            addArrayItem('phone', value.trim());
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => {
                        const input = document.querySelector(
                          'input[placeholder="Add new phone number"]',
                        ) as HTMLInputElement;
                        if (input && input.value.trim()) {
                          addArrayItem('phone', input.value.trim());
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {lead.phone && lead.phone.length > 0 ? (
                    lead.phone.map((phone, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        startContent={<MdPhone />}
                      >
                        <a href={`tel:${phone}`} className="hover:text-primary">
                          {phone}
                        </a>
                      </Chip>
                    ))
                  ) : (
                    <span className="text-gray-500">No phone numbers</span>
                  )}
                </div>
              )}
            </div>

            {/* Email Addresses */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Addresses</label>
              {isEditMode ? (
                <div className="space-y-2">
                  {(lead.emails || []).map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={email}
                        onChange={(e) =>
                          updateArrayItem('emails', index, e.target.value)
                        }
                        startContent={<MdEmail className="text-gray-400" />}
                        placeholder="Enter email address"
                        type="email"
                      />
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => removeArrayItem('emails', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new email address"
                      startContent={<MdEmail className="text-gray-400" />}
                      type="email"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          if (value.trim()) {
                            addArrayItem('emails', value.trim());
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => {
                        const input = document.querySelector(
                          'input[placeholder="Add new email address"]',
                        ) as HTMLInputElement;
                        if (input && input.value.trim()) {
                          addArrayItem('emails', input.value.trim());
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {lead.emails && lead.emails.length > 0 ? (
                    lead.emails.map((email, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        startContent={<MdEmail />}
                      >
                        <a
                          href={`mailto:${email}`}
                          className="hover:text-primary"
                        >
                          {email}
                        </a>
                      </Chip>
                    ))
                  ) : (
                    <span className="text-gray-500">No email addresses</span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Contact Person"
                value={lead.contactPerson || ''}
                onChange={(e) =>
                  handleInputChange('contactPerson', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Contact First Name"
                value={lead.contactFirstName || ''}
                onChange={(e) =>
                  handleInputChange('contactFirstName', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Contact Last Name"
                value={lead.contactLastName || ''}
                onChange={(e) =>
                  handleInputChange('contactLastName', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Contact Profession"
                value={lead.contactProfession || ''}
                onChange={(e) =>
                  handleInputChange('contactProfession', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Location Information
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Location"
                value={lead.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="City"
                value={lead.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Country"
                value={lead.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Postal Code"
                value={lead.postalCode || ''}
                onChange={(e) =>
                  handleInputChange('postalCode', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Business Information
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Foundation Year"
                type="number"
                value={lead.foundationYear?.toString() || ''}
                onChange={(e) =>
                  handleInputChange(
                    'foundationYear',
                    parseInt(e.target.value) || null,
                  )
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Branch Count"
                type="number"
                value={lead.branchCount?.toString() || ''}
                onChange={(e) =>
                  handleInputChange(
                    'branchCount',
                    parseInt(e.target.value) || null,
                  )
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Estimated Revenue"
                value={lead.estimatedRevenue || ''}
                onChange={(e) =>
                  handleInputChange('estimatedRevenue', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Atmosphere"
                value={lead.atmosphere || ''}
                onChange={(e) =>
                  handleInputChange('atmosphere', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
              <Input
                label="Booking Situation"
                value={lead.bookingSituation || ''}
                onChange={(e) =>
                  handleInputChange('bookingSituation', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
              />
            </div>

            {isEditMode && (
              <div className="flex items-center gap-2">
                <Switch
                  isSelected={lead.trainsApprentices || false}
                  onValueChange={(value) =>
                    handleInputChange('trainsApprentices', value)
                  }
                />
                <label>Trains Apprentices</label>
              </div>
            )}
            {!isEditMode && lead.trainsApprentices !== null && (
              <div className="text-sm">
                <strong>Trains Apprentices:</strong>{' '}
                {lead.trainsApprentices ? 'Yes' : 'No'}
              </div>
            )}
          </div>

          {/* Services and Offerings */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Services and Offerings
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  label="Services Offered (comma separated)"
                  value={lead.servicesOffered?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('servicesOffered', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.servicesOffered &&
                  lead.servicesOffered.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.servicesOffered.map((service, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="primary"
                        >
                          {service}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Specializations (comma separated)"
                  value={lead.specializations?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('specializations', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.specializations &&
                  lead.specializations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.specializations.map((spec, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="secondary"
                        >
                          {spec}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Popular Services (comma separated)"
                  value={lead.popularServices?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('popularServices', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.popularServices &&
                  lead.popularServices.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.popularServices.map((service, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="success"
                        >
                          {service}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Price Categories (comma separated)"
                  value={lead.priceCategories?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('priceCategories', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.priceCategories &&
                  lead.priceCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.priceCategories.map((category, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="warning"
                        >
                          {category}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Special Features (comma separated)"
                  value={lead.specialFeatures?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('specialFeatures', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.specialFeatures &&
                  lead.specialFeatures.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.specialFeatures.map((feature, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="default"
                        >
                          {feature}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Marketing and Tags */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Marketing and Tags
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  label="Tags (comma separated)"
                  value={lead.tags?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('tags', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode && lead.tags && lead.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {lead.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        color="secondary"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Input
                  label="Target Audience (comma separated)"
                  value={lead.targetAudience?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('targetAudience', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.targetAudience &&
                  lead.targetAudience.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.targetAudience.map((audience, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="warning"
                        >
                          {audience}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="SEO Keywords (comma separated)"
                  value={lead.seoKeywords?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('seoKeywords', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.seoKeywords &&
                  lead.seoKeywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.seoKeywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="default"
                        >
                          {keyword}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Promotional Offers (comma separated)"
                  value={lead.promotionalOffers?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('promotionalOffers', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.promotionalOffers &&
                  lead.promotionalOffers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.promotionalOffers.map((offer, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="success"
                        >
                          {offer}
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Media Assets (comma separated URLs)"
                  value={lead.mediaAssets?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('mediaAssets', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                />
                {!isEditMode &&
                  lead.mediaAssets &&
                  lead.mediaAssets.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.mediaAssets.map((asset, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="primary"
                        >
                          <a
                            href={asset}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            Media {index + 1}
                          </a>
                        </Chip>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Customer Reviews
            </h4>

            {/* Reviews Summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Average Rating"
                value={formData.reviews_average || ''}
                onChange={(e) =>
                  setFormData({ ...formData, reviews_average: e.target.value })
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                placeholder="e.g., 4.5"
              />
              <Input
                label="Total Reviews Count"
                value={formData.reviews_count || ''}
                onChange={(e) =>
                  setFormData({ ...formData, reviews_count: e.target.value })
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                placeholder="e.g., 150"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Textarea
                  label="Positive Reviews (comma separated)"
                  value={lead.positiveReviews?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('positiveReviews', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                  rows={3}
                />
                {!isEditMode &&
                  lead.positiveReviews &&
                  lead.positiveReviews.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {lead.positiveReviews.slice(0, 3).map((review, index) => (
                        <div
                          key={index}
                          className="rounded-md bg-green-50 p-2 text-sm text-green-800"
                        >
                          {review}
                        </div>
                      ))}
                      {lead.positiveReviews.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{lead.positiveReviews.length - 3} more positive
                          reviews
                        </div>
                      )}
                    </div>
                  )}
              </div>

              <div>
                <Textarea
                  label="Negative Reviews (comma separated)"
                  value={lead.negativeReviews?.join(', ') || ''}
                  onChange={(e) =>
                    handleArrayInputChange('negativeReviews', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                  rows={3}
                />
                {!isEditMode &&
                  lead.negativeReviews &&
                  lead.negativeReviews.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {lead.negativeReviews.slice(0, 3).map((review, index) => (
                        <div
                          key={index}
                          className="rounded-md bg-red-50 p-2 text-sm text-red-800"
                        >
                          {review}
                        </div>
                      ))}
                      {lead.negativeReviews.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{lead.negativeReviews.length - 3} more negative
                          reviews
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Sources */}
          {lead.sources && lead.sources.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-primary text-lg font-semibold">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {lead.sources.map((source, index) => (
                  <Chip key={index} size="sm" variant="flat" color="success">
                    {source}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Additional Information
            </h4>

            {/* JSON Fields - Display as formatted text in view mode, textarea in edit mode */}
            {(lead.openingHours ||
              lead.teamInfo ||
              lead.employeeDetail ||
              lead.socialMediaHandles ||
              lead.sourceIds) && (
              <div className="grid grid-cols-1 gap-4">
                {lead.openingHours && (
                  <div>
                    <label className="text-sm font-medium">Opening Hours</label>
                    {isEditMode ? (
                      <Textarea
                        value={
                          typeof lead.openingHours === 'string'
                            ? lead.openingHours
                            : JSON.stringify(lead.openingHours, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleInputChange('openingHours', parsed);
                          } catch {
                            handleInputChange('openingHours', e.target.value);
                          }
                        }}
                        placeholder="Enter opening hours as JSON"
                        rows={3}
                      />
                    ) : (
                      <div className="rounded-md bg-gray-50 p-3 text-sm">
                        <pre className="whitespace-pre-wrap">
                          {typeof lead.openingHours === 'string'
                            ? lead.openingHours
                            : JSON.stringify(lead.openingHours, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {lead.teamInfo && (
                  <div>
                    <label className="text-sm font-medium">
                      Team Information
                    </label>
                    {isEditMode ? (
                      <Textarea
                        value={
                          typeof lead.teamInfo === 'string'
                            ? lead.teamInfo
                            : JSON.stringify(lead.teamInfo, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleInputChange('teamInfo', parsed);
                          } catch {
                            handleInputChange('teamInfo', e.target.value);
                          }
                        }}
                        placeholder="Enter team information as JSON"
                        rows={3}
                      />
                    ) : (
                      <div className="rounded-md bg-gray-50 p-3 text-sm">
                        <pre className="whitespace-pre-wrap">
                          {typeof lead.teamInfo === 'string'
                            ? lead.teamInfo
                            : JSON.stringify(lead.teamInfo, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {lead.employeeDetail && (
                  <div>
                    <label className="text-sm font-medium">
                      Employee Details
                    </label>
                    {isEditMode ? (
                      <Textarea
                        value={
                          typeof lead.employeeDetail === 'string'
                            ? lead.employeeDetail
                            : JSON.stringify(lead.employeeDetail, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleInputChange('employeeDetail', parsed);
                          } catch {
                            handleInputChange('employeeDetail', e.target.value);
                          }
                        }}
                        placeholder="Enter employee details as JSON"
                        rows={3}
                      />
                    ) : (
                      <div className="rounded-md bg-gray-50 p-3 text-sm">
                        <pre className="whitespace-pre-wrap">
                          {typeof lead.employeeDetail === 'string'
                            ? lead.employeeDetail
                            : JSON.stringify(lead.employeeDetail, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {lead.socialMediaHandles && (
                  <div>
                    <label className="text-sm font-medium">
                      Social Media Handles
                    </label>
                    {isEditMode ? (
                      <Textarea
                        value={
                          typeof lead.socialMediaHandles === 'string'
                            ? lead.socialMediaHandles
                            : JSON.stringify(lead.socialMediaHandles, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleInputChange('socialMediaHandles', parsed);
                          } catch {
                            handleInputChange(
                              'socialMediaHandles',
                              e.target.value,
                            );
                          }
                        }}
                        placeholder='Enter social media handles as JSON, e.g. {"facebook": "...", "instagram": "..."}'
                        rows={3}
                      />
                    ) : (
                      <div className="rounded-md bg-gray-50 p-3 text-sm">
                        <pre className="whitespace-pre-wrap">
                          {typeof lead.socialMediaHandles === 'string'
                            ? lead.socialMediaHandles
                            : JSON.stringify(lead.socialMediaHandles, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {lead.sourceIds && (
                  <div>
                    <label className="text-sm font-medium">Source IDs</label>
                    {isEditMode ? (
                      <Textarea
                        value={
                          typeof lead.sourceIds === 'string'
                            ? lead.sourceIds
                            : JSON.stringify(lead.sourceIds, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleInputChange('sourceIds', parsed);
                          } catch {
                            handleInputChange('sourceIds', e.target.value);
                          }
                        }}
                        placeholder="Enter source IDs mapping as JSON"
                        rows={3}
                      />
                    ) : (
                      <div className="rounded-md bg-gray-50 p-3 text-sm">
                        <pre className="whitespace-pre-wrap">
                          {typeof lead.sourceIds === 'string'
                            ? lead.sourceIds
                            : JSON.stringify(lead.sourceIds, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadata - Only show for existing leads */}
          {mode !== 'create' && (
            <div className="space-y-4">
              <h4 className="text-primary text-lg font-semibold">Metadata</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-sm">
                  <strong>Created:</strong>{' '}
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString()
                    : 'N/A'}
                </div>
                <div className="text-sm">
                  <strong>Last Updated:</strong>{' '}
                  {lead.updatedAt
                    ? new Date(lead.updatedAt).toLocaleString()
                    : 'N/A'}
                </div>
                <div className="text-sm">
                  <strong>Scraped At:</strong>{' '}
                  {lead.scrapedAt
                    ? new Date(lead.scrapedAt).toLocaleString()
                    : 'N/A'}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
