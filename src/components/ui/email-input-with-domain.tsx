'use client';

import { Input } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { LuMail } from 'react-icons/lu';

import { useFetch } from '@/hook/useFetch';

interface DomainType {
  id: number;
  name: string;
  status: string;
  verified: boolean;
  createdAt: string;
}

interface EmailInputWithDomainProps {
  username?: string;
  domain?: string;
  onUsernameChange?: (username: string) => void;
  onDomainChange?: (domain: string) => void;
  onEmailChange?: (email: string) => void;
  isRequired?: boolean;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  description?: string;
}

export default function EmailInputWithDomain({
  username = '',
  domain = '',
  onUsernameChange = () => {},
  onDomainChange = () => {},
  onEmailChange = () => {},
  isRequired = false,
  isLoading = false,
  label = 'Email Address',
  placeholder = 'Enter username',
  description = 'Username and domain for the sender email',
}: EmailInputWithDomainProps) {
  const [usernameInput, setUsernameInput] = useState(username);
  const [selectedDomain, setSelectedDomain] = useState(domain);
  const [domains, setDomains] = useState<DomainType[]>([]);

  useEffect(() => {
    if (username !== usernameInput) {
      setUsernameInput(username);
    }
  }, [username, usernameInput]);

  useEffect(() => {
    if (domain !== selectedDomain) {
      setSelectedDomain(domain);
    }
  }, [domain, selectedDomain]);

  useEffect(() => {
    const newEmail =
      usernameInput && selectedDomain
        ? `${usernameInput}@${selectedDomain}`
        : '';

    onEmailChange(newEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameInput, selectedDomain]);

  // Fetch domains from Mailtrap API
  const { fetchData: fetchDomains, isLoading: domainsLoading } = useFetch<{
    data: DomainType[];
  }>('/api/mailtrap/domains', {
    onSuccess: (response) => {
      const fetchedDomains = response?.data || [];
      setDomains(fetchedDomains);
      // If no domain is selected and there are domains available, select the first verified one
      if (!selectedDomain && fetchedDomains.length > 0) {
        const verifiedDomain = fetchedDomains.find((d) => d.verified);
        const firstDomain = verifiedDomain || fetchedDomains[0];
        if (firstDomain) {
          setSelectedDomain(firstDomain.name);
          onDomainChange(firstDomain.name);
        }
      }
    },
    onError: (error) => {
      console.error('Error fetching domains:', error);
      setDomains([]);
    },
  });

  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUsernameChange = useCallback(
    (value: string) => {
      // Remove any @ symbols to prevent email format conflicts
      const cleanUsername = value.replace(/@.*$/, '');

      // Update state immediately to prevent flipping
      setUsernameInput(cleanUsername);
      onUsernameChange(cleanUsername);
    },
    [onUsernameChange],
  );

  const handleDomainChange = useCallback(
    (value: string) => {
      setSelectedDomain(value);
      onDomainChange(value);
    },
    [onDomainChange],
  );

  return (
    <Input
      placeholder={placeholder}
      label={label}
      value={usernameInput}
      onChange={(e) => handleUsernameChange(e.target.value)}
      variant="bordered"
      color="primary"
      isRequired={isRequired}
      isDisabled={isLoading}
      startContent={<LuMail className="text-sm" />}
      key="username-input"
      endContent={
        <div className="flex items-center">
          <label className="sr-only" htmlFor="domain-select">
            Domain
          </label>
          <select
            className="text-small text-default-400 min-w-0 border-0 bg-transparent outline-transparent"
            id="domain-select"
            name="domain"
            value={selectedDomain}
            onChange={(e) => handleDomainChange(e.target.value)}
            disabled={domainsLoading}
          >
            <option value="" disabled>
              {domainsLoading
                ? 'Loading domains...'
                : domains.length > 0
                  ? 'Select Domain'
                  : 'No domains available'}
            </option>
            {domains
              .sort((a, b) => {
                // Sort verified domains first
                if (a.verified && !b.verified) return -1;
                if (!a.verified && b.verified) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((domainOption) => (
                <option key={domainOption.name} value={domainOption.name}>
                  @{domainOption.name}
                </option>
              ))}
          </select>
        </div>
      }
      description={
        usernameInput && selectedDomain
          ? (() => {
              return `Full email: ${usernameInput}@${selectedDomain}`;
            })()
          : description
      }
    />
  );
}
