'use client';

import { Button, Link } from '@heroui/react';
import React from 'react';
import { BsClockHistory } from 'react-icons/bs';

export default function ComingSoon({
  page,
  home = true,
  app = true,
}: Readonly<{
  page?: string;
  home?: boolean;
  app?: boolean;
}>) {
  return (
    <div className="my-10 flex min-h-[500px] flex-col items-center justify-center">
      {page && <p className="mb-5 text-lg">You are on the {page} page.</p>}
      <h1 className="text-primary-500 mb-8 flex animate-pulse items-center gap-4 text-5xl font-bold max-sm:text-3xl">
        <BsClockHistory />
        Coming Soon
      </h1>
      <p className="mb-8 text-center text-lg">
        We are working hard to bring you something amazing. Stay tuned!
      </p>
      <div className="flex justify-center gap-2">
        {home && (
          <Button as={Link} href="/" color="primary" variant="bordered">
            Go to Home
          </Button>
        )}
        {app && (
          <Button as={Link} href="/app" color="primary" variant="solid">
            Go to App
          </Button>
        )}
      </div>
    </div>
  );
}
