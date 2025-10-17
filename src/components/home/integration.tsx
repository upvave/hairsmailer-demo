'use client';

import { Button, Chip } from '@heroui/react';
import AOS from 'aos';
import Link from 'next/link';
import { useEffect } from 'react';

// Dummy icons, replace with your actual icon components or images
const icons = ['🟡', '🟢', '🟦', '🔵', '🟧', '🟣'];
const icons1 = ['🟡', '🟢', '🟦', '🔵', '🟧', '🟣', '🟡'];

export default function Integration() {
  useEffect(() => {
    AOS.init({
      duration: 400,
      once: false,
    });
  });
  return (
    <section className="bg-background flex w-full flex-col items-center justify-center py-16">
      <div className="flex max-w-7xl flex-col items-center justify-center gap-4">
        <Chip
          data-aos="fade-up"
          color="primary"
          classNames={{
            content:
              'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text sm:text-lg text-medium md:text-xl font-medium text-transparent',
            base: 'p-4 py-6 bg-primary-500/30',
          }}
        >
          Integration
        </Chip>
        <div
          data-aos="fade-up"
          className=" mt-7 flex w-full flex-col items-center gap-7 "
        >
          {/* Main Heading */}
          <h1 className="text-foreground-900 text-center text-3xl font-semibold sm:text-4xl md:text-5xl  lg:text-6xl">
            Connect with Your Favorite Tools
          </h1>
          <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-xl">
            Integrate seamlessly with CRM systems, analytics platforms, and
            marketing tools. Connect with over 200+ business applications to
            streamline your workflow.
          </p>
          <Button
            as={Link}
            href="/integration"
            color="primary"
            className="mt-4"
          >
            See All
          </Button>
        </div>
        <div className="flex w-fit flex-wrap  items-center justify-center gap-4 ">
          {icons.map((icon, idx) => (
            <div
              key={idx}
              className="bg-primary-800 flex items-center justify-center rounded-xl shadow-xl"
              style={{
                width: 70,
                height: 70,
                boxShadow: '0 0 40px 0 #23223a, 0 0 20px 0 #23223a inset',
              }}
            >
              <span className="text-4xl">{icon}</span>
            </div>
          ))}
        </div>
        <div className="flex w-fit flex-wrap  items-center justify-center gap-4">
          {icons1.map((icon, idx) => (
            <div
              key={idx}
              className="bg-primary-800 flex items-center justify-center rounded-xl shadow-xl"
              style={{
                width: 70,
                height: 70,
                boxShadow: '0 0 40px 0 #23223a, 0 0 20px 0 #23223a inset',
              }}
            >
              <span className="text-4xl">{icon}</span>
            </div>
          ))}
        </div>
        <div className="flex w-fit flex-wrap  items-center justify-center gap-4">
          {icons.map((icon, idx) => (
            <div
              key={idx}
              className="bg-primary-800 flex items-center justify-center rounded-xl shadow-xl"
              style={{
                width: 70,
                height: 70,
                boxShadow: '0 0 40px 0 #23223a, 0 0 20px 0 #23223a inset',
              }}
            >
              <span className="text-4xl">{icon}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
