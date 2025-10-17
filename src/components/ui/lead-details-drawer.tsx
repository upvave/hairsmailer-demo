'use client';

import {
  Button,
  Checkbox,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/react';
import { LuExternalLink, LuMail, LuPhone, LuX } from 'react-icons/lu';

import {
  LEAD_ATTRIBUTES,
  useCampaignAttributes,
} from '@/context/campaign-attribute-context';

interface Lead {
  id: number;
  name: string;
  category?: string;
  phone?: string[];
  emails?: string[];
  location?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  contactPerson?: string;
  branchCount?: number;
  foundationYear?: number;
  employeeDetail?: any;
  trainsApprentices?: boolean;
  servicesOffered?: string[];
  specializations?: string[];
  priceCategories?: string[];
  positiveReviews?: string[];
  negativeReviews?: string[];
  specialFeatures?: string[];
  priceRange?: string;
  atmosphere?: string;
  openingHours?: any;
  bookingSituation?: string;
  description?: string;
  mediaAssets?: string[];
  teamInfo?: any;
  website?: string;
  sources?: string[];
  sourceIds?: any;
  contactFirstName?: string;
  contactLastName?: string;
  contactProfession?: string;
  socialMediaHandles?: any;
  seoKeywords?: string[];
  tags?: string[];
  promotionalOffers?: string[];
  estimatedRevenue?: string;
  targetAudience?: string[];
  popularServices?: string[];
  reviews_average?: string;
  reviews_count?: string;
  scrapedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LeadDetailsDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailsDrawer({
  lead,
  isOpen,
  onClose,
}: LeadDetailsDrawerProps) {
  // Use the global campaign attribute settings
  const { includedAttributes, toggleAttribute } = useCampaignAttributes();

  const renderAttributeValue = (attribute: any, value: any) => {
    if (!value && value !== false && value !== 0) {
      return <span className="text-foreground-400 text-sm">N/A</span>;
    }

    // Handle different data types
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-foreground-400 text-sm">N/A</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Chip key={index} variant="flat" color="primary" size="sm">
              {String(item)}
            </Chip>
          ))}
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <Chip variant="flat" color={value ? 'success' : 'default'} size="sm">
          {value ? 'Yes' : 'No'}
        </Chip>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="bg-default-100 rounded-lg p-3">
          <pre className="overflow-auto text-xs">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    }

    // Handle special fields
    if (attribute.key === 'emails' && value) {
      return (
        <div className="flex items-center gap-2">
          <LuMail className="text-foreground-400" />
          <a
            href={`mailto:${value}`}
            className="text-primary hover:text-primary-600 underline"
          >
            {value}
          </a>
        </div>
      );
    }

    if (attribute.key === 'phone' && value) {
      return (
        <div className="flex items-center gap-2">
          <LuPhone className="text-foreground-400" />
          <a
            href={`tel:${value}`}
            className="text-primary hover:text-primary-600 underline"
          >
            {value}
          </a>
        </div>
      );
    }

    if (attribute.key === 'website' && value) {
      return (
        <div className="flex items-center gap-2">
          <LuExternalLink className="text-foreground-400" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-600 underline"
          >
            {value}
          </a>
        </div>
      );
    }

    if (attribute.key === 'sources' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((source, index) => {
            // Get the corresponding source ID if available
            const sourceIds = (lead as any).sourceIds || {};
            const sourceId = sourceIds[source] || null;

            const getSourceIcon = (sourceName: string) => {
              switch (sourceName) {
                case 'google-maps':
                  return '🗺️';
                case 'firmen':
                  return '🏢';
                case 'treatwell':
                  return '💅';
                case 'manual-add':
                  return '✋';
                default:
                  return '📄';
              }
            };

            const getSourceUrl = (sourceName: string, id: string | null) => {
              if (!id) return null;

              switch (sourceName) {
                case 'google-maps':
                  return `https://maps.google.com/?cid=${id}`;
                case 'firmen':
                  return `https://www.firmen.de/firma/${id}`;
                case 'treatwell':
                  return `https://www.treatwell.de/salon/${id}`;
                default:
                  return null;
              }
            };

            const sourceUrl = getSourceUrl(source, sourceId);
            const icon = getSourceIcon(source);
            const displayName =
              source === 'google-maps'
                ? 'Google Maps'
                : source === 'firmen'
                  ? 'Firmen'
                  : source === 'treatwell'
                    ? 'Treatwell'
                    : source === 'manual-add'
                      ? 'Manual'
                      : source;

            if (sourceUrl) {
              return (
                <a
                  key={index}
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-default-100 hover:bg-default-200 flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors"
                  title={`View on ${displayName} (ID: ${sourceId})`}
                >
                  <span>{icon}</span>
                  <span>{displayName}</span>
                  <LuExternalLink className="text-xs" />
                </a>
              );
            } else {
              return (
                <span
                  key={index}
                  className="bg-default-100 flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                  title={
                    sourceId ? `ID: ${sourceId}` : 'No source URL available'
                  }
                >
                  <span>{icon}</span>
                  <span>{displayName}</span>
                </span>
              );
            }
          })}
        </div>
      );
    }

    // Handle dates
    if (
      (attribute.key.includes('At') || attribute.key.includes('Date')) &&
      value
    ) {
      const date = new Date(value);
      return (
        <span className="text-foreground">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </span>
      );
    }

    return <span className="text-foreground">{String(value)}</span>;
  };

  if (!lead) {
    return null;
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      placement="right"
      closeButton={false}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              Lead Details - {lead.name}
            </h4>
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
              aria-label="Close drawer"
            >
              <LuX className="text-xl" />
            </Button>
          </div>
          <p className="text-foreground-600 text-sm">
            Toggle attributes to include/exclude from campaign
          </p>
        </DrawerHeader>

        <DrawerBody>
          <div className="space-y-4">
            {LEAD_ATTRIBUTES.map((attribute) => {
              const value = (lead as any)[attribute.key];
              const hasValue =
                value !== undefined && value !== null && value !== '';
              const isIncluded = includedAttributes[attribute.key];
              const isRequired = attribute.required;

              return (
                <div
                  key={attribute.key}
                  className={`rounded-lg border p-4 transition-all ${
                    !isIncluded ? 'bg-default-50 opacity-50' : 'bg-background'
                  } ${isRequired ? 'border-primary' : 'border-divider'}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={isIncluded}
                      onValueChange={() => toggleAttribute(attribute.key)}
                      isDisabled={isRequired}
                      color="primary"
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-foreground-600 text-sm font-medium">
                          {attribute.label}
                        </label>
                        {isRequired && (
                          <Chip size="sm" color="danger" variant="flat">
                            Required
                          </Chip>
                        )}
                        {!hasValue && (
                          <Chip size="sm" color="default" variant="flat">
                            No Data
                          </Chip>
                        )}
                      </div>
                      <div
                        className={`${!isIncluded && !isRequired ? 'opacity-50' : ''}`}
                      >
                        {renderAttributeValue(attribute, value)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <div className="text-foreground-600 text-sm">
            {
              LEAD_ATTRIBUTES.filter((attr) => includedAttributes[attr.key])
                .length
            }{' '}
            of {LEAD_ATTRIBUTES.length} attributes included
          </div>
          <Button color="primary" variant="flat" onPress={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
