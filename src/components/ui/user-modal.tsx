'use client';

import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { PiEye, PiNotePencil } from 'react-icons/pi';

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role?: Role;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  _count: {
    sessions: number;
    activityLogs: number;
  };
}

interface UserModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'create';
  onSave?: () => void;
}

export default function UserModal({
  userId,
  isOpen,
  onClose,
  mode,
  onSave,
}: UserModalProps) {
  const [isEditMode, setIsEditMode] = useState(
    mode === 'edit' || mode === 'create',
  );
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Fetch roles on component mount
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  // Fetch user data or initialize for create mode
  useEffect(() => {
    if (mode === 'create') {
      // Initialize with default values for new user
      setFormData({
        name: '',
        email: '',
        isActive: true,
        emailVerified: false,
      });
    } else if (userId && isOpen) {
      // Fetch existing user data
      fetch(`/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setFormData(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          addToast({
            color: 'danger',
            title: 'Failed to fetch user details',
            timeout: 3000,
          });
        });
    }
  }, [userId, isOpen, mode]);

  // Reset edit mode when mode changes
  useEffect(() => {
    setIsEditMode(mode === 'edit' || mode === 'create');
  }, [mode]);

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      if (response.ok) {
        setRoles(data);
      } else {
        throw new Error(data.error || 'Failed to fetch roles');
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      addToast({
        color: 'danger',
        title: 'Failed to fetch roles',
        timeout: 3000,
      });
    } finally {
      setRolesLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      addToast({
        color: 'danger',
        title: 'Name and email are required',
        timeout: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const url = mode === 'create' ? '/api/users' : `/api/users/${userId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          roleId: formData.role?.id,
          isActive: formData.isActive,
          emailVerified: formData.emailVerified,
          ...(mode === 'create' && { password: 'defaultPassword123!' }), // Default password for new users
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Failed to ${mode === 'create' ? 'create' : 'update'} user`,
        );
      }

      addToast({
        color: 'success',
        title:
          result.message ||
          `User ${mode === 'create' ? 'created' : 'updated'} successfully`,
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
        `Error ${mode === 'create' ? 'creating' : 'updating'} user:`,
        error,
      );
      addToast({
        color: 'danger',
        title:
          error.message ||
          `Failed to ${mode === 'create' ? 'create' : 'update'} user`,
        timeout: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleClose = () => {
    setIsEditMode(mode === 'edit' || mode === 'create');
    setFormData({});
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!formData.name && !isOpen && mode !== 'create') {
    return null;
  }

  const user = formData;

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
                ? 'Create New User'
                : isEditMode
                  ? 'Edit User'
                  : 'User Details'}
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
                isDisabled={!user.name || !user.email}
              >
                {mode === 'create' ? 'Create User' : 'Save Changes'}
              </Button>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="gap-6 pb-10">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Name"
                value={user.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                isRequired
              />
              <Input
                label="Email"
                type="email"
                value={user.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                isReadOnly={!isEditMode}
                variant={isEditMode ? 'bordered' : 'flat'}
                isRequired
              />
            </div>
          </div>

          {/* Role and Status */}
          <div className="space-y-4">
            <h4 className="text-primary text-lg font-semibold">
              Role and Status
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label="Role"
                placeholder="Select a role"
                selectedKeys={user.role?.id ? [user.role.id.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedRoleId = Array.from(keys)[0] as string;
                  const selectedRole = roles.find(
                    (role) => role.id.toString() === selectedRoleId,
                  );
                  handleInputChange('role', selectedRole);
                }}
                isDisabled={!isEditMode || rolesLoading}
                variant={isEditMode ? 'bordered' : 'flat'}
              >
                {roles.map((role) => (
                  <SelectItem key={role.id.toString()}>{role.name}</SelectItem>
                ))}
              </Select>

              <div className="flex flex-col gap-3">
                <Switch
                  isSelected={user.isActive || false}
                  onValueChange={(value) =>
                    handleInputChange('isActive', value)
                  }
                  isDisabled={!isEditMode}
                  color="success"
                >
                  <span className="text-sm">Active User</span>
                </Switch>
                {mode !== 'create' && (
                  <Switch
                    isSelected={user.emailVerified || false}
                    onValueChange={(value) =>
                      handleInputChange('emailVerified', value)
                    }
                    isDisabled={!isEditMode}
                    color="primary"
                  >
                    <span className="text-sm">Email Verified</span>
                  </Switch>
                )}
              </div>
            </div>
          </div>

          {/* User Statistics (only for existing users) */}
          {mode !== 'create' && (
            <div className="space-y-4">
              <h4 className="text-primary text-lg font-semibold">
                User Statistics
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <label className="text-sm font-medium text-gray-600">
                    Last Login
                  </label>
                  <p className="mt-1 text-sm">{formatDate(user.lastLoginAt)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <label className="text-sm font-medium text-gray-600">
                    Created At
                  </label>
                  <p className="mt-1 text-sm">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              {user._count && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <label className="text-sm font-medium text-gray-600">
                      Active Sessions
                    </label>
                    <p className="mt-1 text-lg font-semibold text-blue-600">
                      {user._count.sessions}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <label className="text-sm font-medium text-gray-600">
                      Activity Logs
                    </label>
                    <p className="mt-1 text-lg font-semibold text-green-600">
                      {user._count.activityLogs}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Password Reset Notice for new users */}
          {mode === 'create' && (
            <div className="border-warning-300 bg-warning-50 rounded-lg border-2 p-4">
              <div className="flex items-center gap-2">
                <div className="bg-warning-500 size-5 rounded-full" />
                <p className="text-warning-800 text-sm font-medium">
                  Default Password Notice
                </p>
              </div>
              <p className="text-warning-700 mt-1 text-sm">
                New users will be created with a default password. They should
                change it upon first login for security.
              </p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
