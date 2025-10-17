'use client';

import { Chip, Image } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import Faq from '@/components/home/faq';
import Started from '@/components/home/started';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';

export default function Page() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  interface cardProps {
    name: string;
    description: string;
    icon: string;
  }

  const cards: cardProps[] = [
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
    {
      name: 'Name',
      description:
        "With insomnia, nothing's real. Everything is far away. Everything is a copy, of a copy, of a copy",
      icon: '/favicon/favicon-512x512.png',
    },
  ];
  return (
    <>
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
            className="mt-7 flex w-full flex-col items-center gap-7"
          >
            {/* Main Heading */}
            <h1 className="text-foreground-900 text-center text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
              Seamless Integrations with Your Tools
            </h1>
            <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-xl">
              Discover how real users have revolutionized their workflows by
              integrating with more than 200 popular business tools for a
              seamless experience.
            </p>
          </div>
          <div className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {cards.map((card, idx) => (
              <div
                key={idx}
                dta-aos="fade-up"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="bg-background shadow-primary-500/30 relative mx-auto flex  size-full flex-col items-start justify-center gap-4 overflow-hidden rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <Image src={card.icon} alt="logo" width={30} height={30} />
                  <h4 className="text-medium text-foreground-900 relative z-20 mx-auto max-w-2xl text-center font-medium sm:text-lg md:text-xl">
                    {card.name}
                  </h4>
                </div>

                <p className="text-medium text-foreground-400 relative z-20 mx-auto max-w-2xl text-left font-normal sm:text-lg md:text-xl">
                  {card.description}
                </p>
                <AnimatePresence>
                  {hoveredIdx === idx && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 size-full"
                    >
                      <CanvasRevealEffect
                        animationSpeed={10}
                        containerClassName="bg-transparent"
                        colors={[
                          [127, 0, 225],
                          [127, 0, 225],
                        ]}
                        opacities={[
                          0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1,
                        ]}
                        dotSize={2}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Faq />
      <Started />
    </>
  );
}
