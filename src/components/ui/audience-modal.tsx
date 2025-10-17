'use client';

import {
  addToast,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
} from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { FiMail, FiPhone, FiUsers } from 'react-icons/fi';
import { PiEye, PiNotePencil, PiPlus, PiTrash } from 'react-icons/pi';

interface Lead {
  id: number;
  name: string;
  category?: string;
  city?: string;
  country?: string;
  phone?: string[];
  emails?: string[];
  website?: string;
  contactPerson?: string;
}

interface Audience {
  id: number;
  name: string;
  description?: string;
  leadIds?: number[];
  leadCount: number;
  createdAt: string;
  updatedAt: string;
  leads?: Array<{
    lead: Lead;
  }>;
}

interface AudienceModalProps {
  audienceId: string | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'create';
  selectedLeadIds?: string[]; // For pre-populating lead IDs when creating from leads page
  currentFilters?: {
    category?: string;
    city?: string;
    contactType?: string;
    search?: string;
  }; // Current filter parameters
  onSave?: () => void;
}

export default function AudienceModal({
  audienceId,
  isOpen,
  onClose,
  mode,
  selectedLeadIds,
  currentFilters,
  onSave,
}: AudienceModalProps) {
  const [isEditMode, setIsEditMode] = useState(
    mode === 'edit' || mode === 'create',
  );
  const [formData, setFormData] = useState<Partial<Audience>>({});
  const [loading, setLoading] = useState(false);
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [selectedNewLeadIds, setSelectedNewLeadIds] = useState<Set<string>>(
    new Set(),
  );
  const [showAddLeads, setShowAddLeads] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch available leads for adding to audience
  const fetchAvailableLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '100'); // Get more leads for selection

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();

      if (data.data) {
        // Filter out leads that are already in the audience
        const currentLeadIds =
          formData.leads?.map((item) => item.lead.id) || [];
        const filteredLeads = data.data.filter(
          (lead: Lead) => !currentLeadIds.includes(lead.id),
        );
        setAvailableLeads(filteredLeads);
      }
    } catch (error) {
      console.error('Error fetching available leads:', error);
    }
  };

  // Remove lead from audience
  const handleRemoveLead = (leadId: number) => {
    setFormData((prev) => ({
      ...prev,
      leads: prev.leads?.filter((item) => item.lead.id !== leadId) || [],
      leadCount: (prev.leadCount || 0) - 1,
      leadIds: prev.leadIds?.filter((id) => id !== leadId) || [],
    }));
  };

  // Add selected leads to audience
  const handleAddSelectedLeads = async () => {
    if (selectedNewLeadIds.size === 0) return;

    try {
      // Fetch full lead details for selected leads
      const leadIds = Array.from(selectedNewLeadIds).map((id) => parseInt(id));
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getByIds', leadIds }),
      });

      const result = await response.json();
      if (result.data) {
        const newLeads = result.data.map((lead: Lead) => ({ lead }));
        setFormData((prev) => ({
          ...prev,
          leads: [...(prev.leads || []), ...newLeads],
          leadCount: (prev.leadCount || 0) + newLeads.length,
          leadIds: [...(prev.leadIds || []), ...leadIds],
        }));

        setSelectedNewLeadIds(new Set());
        setShowAddLeads(false);
        fetchAvailableLeads(); // Refresh available leads
      }
    } catch (error) {
      console.error('Error adding leads:', error);
      addToast({
        color: 'danger',
        title: 'Failed to add leads',
        timeout: 3000,
      });
    }
  };

  useEffect(() => {
    if (mode === 'create' && isOpen) {
      // Initialize with default values for new audience
      if (selectedLeadIds?.length && selectedLeadIds.length > 0) {
        // Use selected leads
        const leadIds = selectedLeadIds.map((id) => parseInt(id));
        setFormData({
          name: '',
          description: '',
          leadIds,
          leadCount: leadIds.length,
        });
      } else {
        // Fetch all leads matching current filters
        const fetchAllFilteredLeads = async () => {
          try {
            const params = new URLSearchParams();
            if (currentFilters?.category)
              params.append('category', currentFilters.category);
            if (currentFilters?.city)
              params.append('city', currentFilters.city);
            if (currentFilters?.contactType)
              params.append('contactType', currentFilters.contactType);
            if (currentFilters?.search)
              params.append('search', currentFilters.search);

            const response = await fetch(`/api/leads?${params.toString()}`);
            const data = await response.json();

            if (data.data) {
              const leadIds = data.data.map((lead: any) => lead.id);
              setFormData({
                name: '',
                description: '',
                leadIds,
                leadCount: leadIds.length,
              });
            }
          } catch (error) {
            console.error('Error fetching filtered leads:', error);
            addToast({
              color: 'danger',
              title: 'Failed to fetch leads for audience',
              timeout: 3000,
            });
          }
        };

        fetchAllFilteredLeads();
      }
    } else if (audienceId && isOpen) {
      // Fetch existing audience data with full lead details
      fetch(`/api/audiences/${audienceId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setFormData({
              ...data.data,
              leadIds: data.data.leads?.map((item: any) => item.lead.id) || [],
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching audience:', error);
          addToast({
            color: 'danger',
            title: 'Failed to fetch audience details',
            timeout: 3000,
          });
        });
    }
  }, [audienceId, isOpen, mode, selectedLeadIds, currentFilters]);

  useEffect(() => {
    setIsEditMode(mode === 'edit' || mode === 'create');
  }, [mode]);

  const handleSave = async () => {
    if (!formData.name) {
      addToast({
        color: 'danger',
        title: 'Audience name is required',
        timeout: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const url =
        mode === 'create' ? '/api/audiences' : `/api/audiences/${audienceId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          leadIds: formData.leadIds || [],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Failed to ${mode === 'create' ? 'create' : 'update'} audience`,
        );
      }

      addToast({
        color: 'success',
        title:
          result.message ||
          `Audience ${mode === 'create' ? 'created' : 'updated'} successfully`,
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
        `Error ${mode === 'create' ? 'creating' : 'updating'} audience:`,
        error,
      );
      addToast({
        color: 'danger',
        title:
          error.message ||
          `Failed to ${mode === 'create' ? 'create' : 'update'} audience`,
        timeout: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Audience, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleClose = () => {
    setIsEditMode(mode === 'edit' || mode === 'create');
    setFormData({});
    onClose();
  };

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const onSearchInputChange = (e: string) => {
    setSearchQuery(e);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchAvailableLeads();
    }, 1500);
  };

  if (!formData.name && !isOpen && mode !== 'create') {
    return null;
  }

  const audience = formData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
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
                ? 'Create New Audience'
                : isEditMode
                  ? 'Edit Audience'
                  : 'Audience Details'}
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
                isDisabled={!audience.name}
              >
                {mode === 'create' ? 'Create Audience' : 'Save Changes'}
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
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Audience Name"
                value={audience.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                isRequired
                placeholder="Enter audience name"
              />
              <Textarea
                label="Description"
                value={audience.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                rows={3}
                placeholder="Enter audience description"
              />
              <Input
                label="Lead Count"
                value={`${audience.leadCount || 0} leads`}
                isReadOnly
                variant="flat"
                startContent={<FiUsers className="text-gray-400" />}
              />
            </div>
          </div>

          {/* Leads Management */}
          {mode !== 'create' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-primary text-lg font-semibold">
                  Leads in this Audience
                </h4>
                {isEditMode && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<PiPlus />}
                    onPress={() => {
                      setShowAddLeads(true);
                      fetchAvailableLeads();
                    }}
                  >
                    Add Leads
                  </Button>
                )}
              </div>

              {/* Add Leads Modal Section */}
              {showAddLeads && isEditMode && (
                <div className="border-primary/20 overflow-hidden rounded-lg border">
                  <div className="flex items-center justify-between p-4">
                    <h5 className="font-semibold">Available Leads</h5>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        isDisabled={selectedNewLeadIds.size === 0}
                        onPress={handleAddSelectedLeads}
                      >
                        Add Selected ({selectedNewLeadIds.size})
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => {
                          setShowAddLeads(false);
                          setSelectedNewLeadIds(new Set());
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <Input
                      placeholder="Search leads..."
                      value={searchQuery}
                      isClearable
                      onClear={() => {
                        setSearchQuery('');
                        setAvailableLeads([]);
                      }}
                      onChange={(e) => onSearchInputChange(e.target.value)}
                    />
                  </div>

                  <Table
                    aria-label="Available leads"
                    radius="none"
                    className="max-h-60 overflow-y-auto"
                    classNames={{
                      wrapper: 'p-0',
                    }}
                    isHeaderSticky
                  >
                    <TableHeader>
                      <TableColumn className="w-12">Select</TableColumn>
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Contact</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {availableLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <Checkbox
                              type="checkbox"
                              isSelected={selectedNewLeadIds.has(
                                lead.id.toString(),
                              )}
                              onChange={(e) => {
                                const newSet = new Set(selectedNewLeadIds);
                                if (e.target.checked) {
                                  newSet.add(lead.id.toString());
                                } else {
                                  newSet.delete(lead.id.toString());
                                }
                                setSelectedNewLeadIds(newSet);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{lead.name}</div>
                              {lead.contactPerson && (
                                <div className="text-foreground-500 text-sm">
                                  {lead.category}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {lead.emails && lead.emails.length > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                  <FiMail size={12} />
                                  {lead.emails[0]}
                                </div>
                              )}
                              {lead.phone && lead.phone.length > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                  <FiPhone size={12} />
                                  {lead.phone[0]}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Current Leads Table */}
              <div>
                {isEditMode ? (
                  <Table
                    aria-label="Audience leads"
                    radius="none"
                    className="max-h-96 overflow-y-auto"
                    classNames={{
                      wrapper: 'p-0',
                    }}
                    isHeaderSticky
                  >
                    <TableHeader>
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Contact</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {(audience.leads || []).map((item) => (
                        <TableRow key={item.lead.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {item.lead.name}
                              </div>
                              {item.lead.contactPerson && (
                                <div className="text-foreground-500 text-sm">
                                  {item.lead.category}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {item.lead.emails &&
                                item.lead.emails.length > 0 && (
                                  <Tooltip
                                    content={item.lead.emails.join(', ')}
                                  >
                                    <div className="flex items-center gap-1 text-xs">
                                      <FiMail size={12} />
                                      {item.lead.emails[0]}
                                      {item.lead.emails.length > 1 &&
                                        ` +${item.lead.emails.length - 1}`}
                                    </div>
                                  </Tooltip>
                                )}
                              {item.lead.phone &&
                                item.lead.phone.length > 0 && (
                                  <Tooltip content={item.lead.phone.join(', ')}>
                                    <div className="flex items-center gap-1 text-xs">
                                      <FiPhone size={12} />
                                      {item.lead.phone[0]}
                                      {item.lead.phone.length > 1 &&
                                        ` +${item.lead.phone.length - 1}`}
                                    </div>
                                  </Tooltip>
                                )}
                              {item.lead.website && (
                                <a
                                  href={item.lead.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary text-xs hover:underline"
                                >
                                  Website
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              isIconOnly
                              onPress={() => handleRemoveLead(item.lead.id)}
                            >
                              <PiTrash className="xl" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Table
                    aria-label="Audience leads"
                    radius="none"
                    className="max-h-96 overflow-y-auto"
                    classNames={{
                      wrapper: 'p-0',
                    }}
                    isHeaderSticky
                  >
                    <TableHeader>
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Contact</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {(audience.leads || []).map((item) => (
                        <TableRow key={item.lead.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {item.lead.name}
                              </div>
                              {item.lead.category}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {item.lead.emails &&
                                item.lead.emails.length > 0 && (
                                  <Tooltip
                                    content={item.lead.emails.join(', ')}
                                  >
                                    <div className="flex items-center gap-1 text-xs">
                                      <FiMail size={12} />
                                      {item.lead.emails[0]}
                                      {item.lead.emails.length > 1 &&
                                        ` +${item.lead.emails.length - 1}`}
                                    </div>
                                  </Tooltip>
                                )}
                              {item.lead.phone &&
                                item.lead.phone.length > 0 && (
                                  <Tooltip content={item.lead.phone.join(', ')}>
                                    <div className="flex items-center gap-1 text-xs">
                                      <FiPhone size={12} />
                                      {item.lead.phone[0]}
                                      {item.lead.phone.length > 1 &&
                                        ` +${item.lead.phone.length - 1}`}
                                    </div>
                                  </Tooltip>
                                )}
                              {item.lead.website && (
                                <a
                                  href={item.lead.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary text-xs hover:underline"
                                >
                                  Website
                                </a>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {(!audience.leads || audience.leads.length === 0) && (
                <div className="text-foreground-500 py-8 text-center">
                  No leads in this audience yet.
                  {isEditMode && ' Click "Add Leads" to get started.'}
                </div>
              )}
            </div>
          )}

          {/* Metadata - Only show for existing audiences */}
          {mode === 'view' && (
            <div className="space-y-4">
              <h4 className="text-primary text-lg font-semibold">Metadata</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="text-sm">
                  <strong>Created:</strong>{' '}
                  {audience.createdAt
                    ? new Date(audience.createdAt).toLocaleString()
                    : 'N/A'}
                </div>
                <div className="text-sm">
                  <strong>Last Updated:</strong>{' '}
                  {audience.updatedAt
                    ? new Date(audience.updatedAt).toLocaleString()
                    : 'N/A'}
                </div>
              </div>
            </div>
          )}
          <div className="mb-10" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
