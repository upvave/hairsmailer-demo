'use client';
import 'aos/dist/aos.css';

import AOS from 'aos';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

export default function Started() {
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
        <div className=" my-6 flex  w-full max-w-7xl flex-col items-center justify-center gap-7 p-6 md:p-12">
          <div
            data-aos="fade-up"
            className="m-10 mt-7 flex w-full flex-col items-center gap-7 lg:w-4/5"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-center text-3xl  font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl "
            >
              Ready to Transform Your Email Marketing?
            </motion.h1>
            <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-xl">
              Join thousands of businesses using AI-powered email marketing to
              drive growth and engagement.
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
                <span className="text-foreground-50 group-hover:bg-foregrund-100 relative z-10 inline-flex size-full items-center justify-center rounded-full bg-gradient-to-r from-[#462a7a] via-[#ae94dc] to-[#462a7a] px-5 py-2 text-lg transition-colors duration-300 sm:text-xl md:text-2xl ">
                  Get Started Free
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
