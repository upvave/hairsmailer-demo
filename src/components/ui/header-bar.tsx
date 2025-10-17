'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { IconType } from 'react-icons';
import { IoMdArrowBack } from 'react-icons/io';

interface HeaderBarProps {
  children?: React.ReactNode;
  back?: boolean;
  backLink?: string;
  heading?: string;
  description?: string;
  Icon?: IconType;
}

export default function HeaderBar({
  children,
  back = true,
  backLink,
  heading,
  description,
  Icon,
}: HeaderBarProps) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-40 flex w-full items-center justify-between gap-3 border-b border-gray-200 bg-white p-2 px-4">
      <div className="flex items-center gap-3">
        {(back || backLink) && (
          <Button
            onPress={() => {
              if (backLink) router.push(backLink);
              else router.back();
            }}
            color="primary"
            variant="light"
            isIconOnly
            size="sm"
          >
            <IoMdArrowBack className="text-xl" />
          </Button>
        )}
        {Icon && <Icon className="text-primary text-lg" />}
        <div className="flex flex-col">
          {heading && (
            <h1 className="text-primary text-lg font-semibold">{heading}</h1>
          )}
          {description && <p className="text-foreground-600">{description}</p>}
        </div>
      </div>
      <div />
      {children}
    </div>
  );
}
