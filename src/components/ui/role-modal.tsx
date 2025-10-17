'use client';

import {
  addToast,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Textarea,
} from '@heroui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { PiEye, PiNotePencil } from 'react-icons/pi';

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

interface Role {
  id: number;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  permissions: Permission[];
}

interface RoleModalProps {
  roleId: number | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'create';
  onSave?: () => void;
}

export default function RoleModal({
  roleId,
  isOpen,
  onClose,
  mode,
  onSave,
}: RoleModalProps) {
  const [isEditMode, setIsEditMode] = useState(
    mode === 'edit' || mode === 'create',
  );
  const [formData, setFormData] = useState<Partial<Role>>({});
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Helper function to check if role is Super Admin
  const isSuperAdmin = (roleName?: string) => {
    return roleName?.toLowerCase() === 'super admin';
  };

  // Helper function to check if role is a system role
  const isSystemRole = useCallback((role?: Partial<Role>) => {
    return role?.isSystemRole || isSuperAdmin(role?.name);
  }, []);

  // Fetch permissions on component mount
  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen]);

  // Fetch role data or initialize for create mode
  useEffect(() => {
    if (mode === 'create') {
      // Initialize with default values for new role
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
      setSelectedPermissions([]);
    } else if (roleId && isOpen) {
      // Fetch existing role data
      setRoleLoading(true);
      fetch(`/api/roles/${roleId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setFormData(data);
            setSelectedPermissions(
              data.permissions?.map((p: Permission) => p.id) || [],
            );
          }
        })
        .catch((error) => {
          console.error('Error fetching role:', error);
          addToast({
            color: 'danger',
            title: 'Failed to fetch role details',
            timeout: 3000,
          });
        })
        .finally(() => {
          setRoleLoading(false);
        });
    }
  }, [roleId, isOpen, mode]);

  useEffect(() => {
    const shouldBeEditMode = mode === 'edit' || mode === 'create';
    // Disable editing for system roles
    if (shouldBeEditMode && isSystemRole(formData)) {
      setIsEditMode(false);
    } else {
      setIsEditMode(shouldBeEditMode);
    }
  }, [mode, formData, isSystemRole]);

  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const response = await fetch('/api/permissions');
      const data = await response.json();
      if (response.ok) {
        setPermissions(data);
      } else {
        throw new Error(data.error || 'Failed to fetch permissions');
      }
    } catch (error: any) {
      console.error('Error fetching permissions:', error);
      addToast({
        color: 'danger',
        title: 'Failed to fetch permissions',
        timeout: 3000,
      });
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      addToast({
        color: 'danger',
        title: 'Role name is required',
        timeout: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const url = mode === 'create' ? '/api/roles' : `/api/roles/${roleId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          permissionIds: selectedPermissions,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Failed to ${mode === 'create' ? 'create' : 'update'} role`,
        );
      }

      addToast({
        color: 'success',
        title:
          result.message ||
          `Role ${mode === 'create' ? 'created' : 'updated'} successfully`,
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
        `Error ${mode === 'create' ? 'creating' : 'updating'} role:`,
        error,
      );
      addToast({
        color: 'danger',
        title:
          error.message ||
          `Failed to ${mode === 'create' ? 'create' : 'update'} role`,
        timeout: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Role, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSelectAllPermissions = (
    resourcePermissions: Permission[],
    isSelected: boolean,
  ) => {
    const resourcePermissionIds = resourcePermissions.map((p) => p.id);

    if (isSelected) {
      // Add all permissions from this resource that aren't already selected
      setSelectedPermissions((prev) => [
        ...prev,
        ...resourcePermissionIds.filter((id) => !prev.includes(id)),
      ]);
    } else {
      // Remove all permissions from this resource
      setSelectedPermissions((prev) =>
        prev.filter((id) => !resourcePermissionIds.includes(id)),
      );
    }
  };

  const isAllResourcePermissionsSelected = (
    resourcePermissions: Permission[],
  ) => {
    const resourcePermissionIds = resourcePermissions.map((p) => p.id);
    return resourcePermissionIds.every((id) =>
      selectedPermissions.includes(id),
    );
  };

  const handleClose = () => {
    setIsEditMode(mode === 'edit' || mode === 'create');
    setFormData({});
    setSelectedPermissions([]);
    onClose();
  };

  if (!formData.name && !isOpen && mode !== 'create') {
    return null;
  }

  const role = formData;

  // Group permissions by resource
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  const renderBasicInfoSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48 rounded-lg" />
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );

  const renderPermissionsSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32 rounded-lg" />
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="mb-3">
              <Skeleton className="h-6 w-40 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[...Array(4)].map((_, permIndex) => (
                <Skeleton key={permIndex} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
                ? 'Create New Role'
                : isEditMode
                  ? 'Edit Role'
                  : 'Role Details'}
            </h3>
          </div>
          <div className="mr-5 flex items-center gap-2">
            {mode === 'view' && !roleLoading && (
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
            {(isEditMode || mode === 'create') && !roleLoading && (
              <Button
                size="sm"
                color="primary"
                onPress={handleSave}
                isLoading={loading}
                isDisabled={!role.name}
              >
                {mode === 'create' ? 'Create Role' : 'Save Changes'}
              </Button>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="gap-6 pb-10">
          {/* Basic Information */}
          {roleLoading ? (
            renderBasicInfoSkeleton()
          ) : (
            <div className="space-y-4">
              <h4 className="text-primary text-lg font-semibold">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Role Name"
                  value={role.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                  isRequired
                />
                <Textarea
                  label="Description"
                  value={role.description || ''}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  isReadOnly={!isEditMode}
                  variant={isEditMode ? 'bordered' : 'flat'}
                  rows={3}
                  placeholder="Enter role description..."
                />
              </div>
            </div>
          )}

          {/* Permissions */}
          {permissionsLoading ? (
            renderPermissionsSkeleton()
          ) : (
            <div className="space-y-4">
              <h4 className="text-primary text-lg font-semibold">
                Permissions
              </h4>
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(
                  ([resource, resourcePermissions]) => (
                    <div key={resource} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center">
                        <Checkbox
                          color="warning"
                          isSelected={isAllResourcePermissionsSelected(
                            resourcePermissions,
                          )}
                          isDisabled={!isEditMode}
                          onValueChange={(isSelected) =>
                            handleSelectAllPermissions(
                              resourcePermissions,
                              isSelected,
                            )
                          }
                        >
                          <h5 className="text-primary text-lg font-semibold capitalize">
                            {resource === '*' ? 'All Resources' : resource}
                          </h5>
                        </Checkbox>
                      </div>
                      <CheckboxGroup
                        value={selectedPermissions}
                        onValueChange={setSelectedPermissions}
                        isDisabled={!isEditMode}
                      >
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                          {resourcePermissions.map((permission) => (
                            <Checkbox
                              key={permission.id}
                              value={permission.id}
                              size="sm"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium capitalize">
                                  {permission.action === '*'
                                    ? 'All Actions'
                                    : permission.action}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {permission.name}
                                </span>
                              </div>
                            </Checkbox>
                          ))}
                        </div>
                      </CheckboxGroup>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
