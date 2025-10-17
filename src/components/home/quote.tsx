'use client';
import 'aos/dist/aos.css';

import { Avatar } from '@heroui/react';
import AOS from 'aos';
import { useEffect } from 'react';

import { FlickeringGrid } from '../magicui/flickering-grid';
import ThreeDCard from './threed-card';

export default function Quote() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  }, []);
  return (
    <>
      <section className="my-5 flex w-full items-center justify-center">
        <div data-aos="fade-up" className="w-full max-w-7xl p-6 md:p-12">
          <ThreeDCard>
            <div
              color="foreground"
              className="relative flex min-w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl px-5 lg:w-3/4"
            >
              <FlickeringGrid
                className="absolute inset-0 z-0 size-full overflow-hidden p-1"
                squareSize={4}
                gridGap={6}
                color="#6B7280"
                maxOpacity={0.3}
                flickerChance={0.1}
              />
              <div className="flex w-full flex-col items-center justify-center gap-4 px-5 py-10 md:w-4/5">
                <p className="text-foreground-900 text-wrap text-left text-lg font-semibold sm:text-xl md:text-center md:text-2xl">
                  &quot;This platform has revolutionized our email marketing
                  strategy. The AI auto-reply and inbox chat features have
                  increased our customer engagement by 300%. The campaign
                  builder is intuitive, and the analytics help us make
                  data-driven decisions. It&apos;s exactly what we needed to
                  scale our business.&quot;
                </p>
                <div className="flex items-center justify-center gap-4">
                  {/* Avatar goes here */}
                  <Avatar size="lg" src="img/image copy 8.png" />
                  <div className="flex flex-col items-start gap-1">
                    <h2 className="text-foreground-900 text-lg font-semibold sm:text-xl md:text-2xl">
                      Sarah Mitchell
                    </h2>
                    <p className="text-foreground-600 text-xs font-normal md:text-sm">
                      Marketing Director, TechGrow Solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ThreeDCard>
        </div>
      </section>
    </>
  );
}
