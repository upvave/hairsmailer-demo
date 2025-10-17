'use client';
import 'aos/dist/aos.css';

import { Chip, Image } from '@heroui/react';
import AOS from 'aos';
import Link from 'next/link';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';
import { ContainerScroll } from '../ui/container-scroll-animation';

export default function Header() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: false, // only animate once
    });
  }, []);
  const customCss = `
    /* This is the key to the seamless animation.
      The @property rule tells the browser that '--angle' is a custom property
      of type <angle>. This allows the browser to smoothly interpolate it
      during animations, preventing the "jump" at the end of the loop.
    */
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    /* The keyframe animation simply transitions the --angle property
      from its start (0deg) to its end (360deg).
    */
    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;

  return (
    <header className="relative flex min-h-screen w-full flex-col items-center justify-center bg-transparent pt-20   md:pt-0">
      {/* Grid Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={1}
        repeatDelay={1}
        className={cn(
          'top-0 h-screen',
          '[mask-image:radial-gradient(circle_at_center,background,transparent)]',
        )}
      />
      {/* Your content goes here */}

      <div className="flex  w-full max-w-7xl  flex-col items-center justify-center gap-7 p-6 md:p-12">
        <ContainerScroll
          titleComponent={
            <>
              <div
                data-aos="fade-up"
                className=" flex w-full items-center justify-center gap-4 pt-4 md:mt-0"
              >
                <Chip
                  color="primary"
                  classNames={{
                    content:
                      'text-nowrap text-base sm:text-lg md:text-xl font-normal',
                    base: 'p-1 py-3 bg-primary-600',
                  }}
                >
                  New
                </Chip>
                <p className="from-primary-600 to-foreground-900 bg-gradient-to-r bg-clip-text text-base font-normal text-transparent  sm:text-lg md:text-xl">
                  AI-Powered CRM & Auto-Reply Now Live!
                </p>
              </div>
              <div
                data-aos="fade-up"
                className=" my-7 flex w-full flex-col items-center gap-10"
              >
                <h1 className="text-foreground-900 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">
                  Transform Your Email Marketing with AI Intelligence
                </h1>
                <p className="text-foreground-400 text-center text-lg font-normal md:text-xl">
                  Manage campaigns, automate responses, and engage customers
                  with our intelligent inbox chat system and AI-powered CRM.
                </p>

                {/* // Main container to center the button on the page */}
                <Link
                  href="/app"
                  target="_self"
                  className="flex items-center justify-center font-sans"
                >
                  <style>{customCss}</style>
                  <button className="bg-foreground-300 group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] transition-all hover:-translate-y-1 ">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'conic-gradient(from var(--angle), transparent 25%, #311c57, transparent 50%)',
                        animation: 'shimmer-spin 2.5s linear infinite',
                      }}
                    />
                    <span className="group-hover:bg-foregrund-100 relative z-10 inline-flex size-full items-center justify-center rounded-full bg-gradient-to-r from-[#462a7a] via-[#ae94dc] to-[#462a7a] px-5 py-2 text-lg text-white transition-colors duration-300 sm:text-xl md:text-2xl ">
                      Get Started Free
                    </span>
                  </button>
                </Link>
              </div>
            </>
          }
        >
          <Image
            src="/img/image.png"
            alt="img"
            className="size-full"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </header>
  );
}
