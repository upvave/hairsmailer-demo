'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import NextTopLoader from 'nextjs-toploader';
import { useRouter } from 'nextjs-toploader/app';
import { Suspense } from 'react';

import tailwindConfig from '../../tailwind.config';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider placement="top-center" />
      <NextTopLoader
        color={tailwindConfig.theme.extend.colors.primary.DEFAULT}
        height={2}
      />
      <Suspense>{children}</Suspense>
    </HeroUIProvider>
  );
}
