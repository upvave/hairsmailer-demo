'use client';
import 'aos/dist/aos.css';

import { Chip } from '@heroui/react';
import AOS from 'aos';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

export default function AboutHero() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: false, // only animate once
    });
  }, []);

  return (
    <header className="relative flex min-h-fit w-full flex-col items-center justify-center bg-transparent">
      <div className="bg-background relative flex w-full items-center justify-center ">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.3}
          duration={1}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(circle_at_center,background,transparent)]',
          )}
        />

        <div className="flex w-full max-w-7xl flex-col items-center  justify-center gap-5 p-6 py-10 md:p-12">
          <Chip
            data-aos="fade-up"
            color="primary"
            classNames={{
              content:
                'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text text-medium sm:text-lg md:text-xl font-medium text-transparent',
              base: 'p-4 py-6 bg-primary-900/30',
            }}
          >
            About
          </Chip>
          <div
            data-aos="fade-up"
            className="m-10 mt-7 flex w-full flex-col items-center gap-7  lg:w-4/5"
          >
            <h1 className="text-foreground-900 text-center text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
              Revolutionizing Email Marketing with AI
            </h1>
            <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-xl">
              Empowering businesses to connect with customers through
              intelligent automation, smart campaigns, and seamless customer
              engagement.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
