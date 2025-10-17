'use client';
import 'aos/dist/aos.css';

import { Chip, Image } from '@heroui/react';
import AOS from 'aos';
import { useEffect } from 'react';

import { CardSpotlight } from '../ui/card-spotlight';
import ThreeDCard from './threed-card';
export default function Features() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: false, // only animate once
    });
  }, []);
  return (
    <>
      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-7xl flex-col items-center  justify-center gap-5 p-6 py-10 md:p-12">
          <Chip
            data-aos="fade-up"
            classNames={{
              content:
                'text-medium from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text sm:text-lg md:text-xl font-medium text-transparent',
              base: 'p-4 py-6 bg-primary-700/50',
            }}
          >
            Features
          </Chip>
          <div
            data-aos="fade-up"
            className="m-10 mt-7 flex w-full flex-col items-center gap-7  lg:w-4/5"
          >
            <h1 className="text-foreground-900 text-center text-3xl font-semibold sm:text-4xl md:text-5xl  lg:text-6xl">
              Powerful Features for Modern Email Marketing
            </h1>
            <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-xl">
              Everything you need to create, manage, and optimize your email
              campaigns with AI-powered intelligence.
            </p>
          </div>
          <div className="flex w-full flex-wrap justify-center gap-4">
            <div className="flex w-full flex-wrap items-center justify-center">
              {/* Card 1 */}
              <div data-aos="fade-up" className="w-full p-3 md:w-4/5 lg:w-1/2">
                <ThreeDCard data-aos="fade-up" parallaxOffset={50}>
                  <CardSpotlight
                    color="foreground"
                    radius={500}
                    className="size-full cursor-pointer rounded-xl"
                  >
                    <div className="flex flex-col gap-6 pb-6 md:h-full">
                      <h3 className="text-foreground-900  text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
                        Smart Campaign Builder
                      </h3>
                      <p className="text-foreground-400 text-medium sm:text-lg md:text-xl">
                        Create stunning email campaigns with drag-and-drop
                        templates and AI-assisted content generation.
                      </p>
                    </div>
                    <Image
                      src="/img/image copy.png"
                      alt="Description"
                      className="max-h-72 w-full rounded-2xl"
                    />
                  </CardSpotlight>
                </ThreeDCard>
              </div>

              {/* Card 2 */}
              <div data-aos="fade-up" className="w-full p-3 md:w-4/5 lg:w-1/2">
                <ThreeDCard data-aos="fade-up" parallaxOffset={50}>
                  <CardSpotlight
                    color="foreground"
                    radius={500}
                    className="size-full cursor-pointer overflow-hidden rounded-xl"
                  >
                    <div className="flex flex-col gap-6 pb-6 md:h-full">
                      <h3 className="text-foreground-900 text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
                        Inbox Chat Management
                      </h3>
                      <p className="text-foreground-400 text-medium sm:text-lg md:text-xl">
                        Engage with customers directly through integrated inbox
                        chat with real-time notifications.
                      </p>
                    </div>
                    <Image
                      src="/img/image copy 2.png"
                      alt="Description"
                      className="max-h-72 w-full rounded-2xl object-cover"
                    />
                  </CardSpotlight>
                </ThreeDCard>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-center">
              {/* Card 3 */}
              <div data-aos="fade-up" className=" w-full p-3 lg:w-1/3 ">
                <ThreeDCard data-aos="fade-up" parallaxOffset={50}>
                  <CardSpotlight
                    color="foreground"
                    radius={500}
                    className="size-full cursor-pointer overflow-hidden rounded-xl"
                  >
                    <div className="flex flex-col gap-6 pb-6">
                      <h3 className="text-foreground-900 text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
                        AI Auto-Reply System
                      </h3>
                      <p className="text-foreground-400 text-medium sm:text-lg md:text-xl">
                        Automatically respond to customer inquiries with
                        intelligent AI-powered responses.
                      </p>
                    </div>
                    <Image
                      src="/img/image copy 3.png"
                      alt="Description"
                      className="max-h-72 w-full rounded-2xl object-cover"
                    />
                  </CardSpotlight>
                </ThreeDCard>
              </div>

              {/* Card 4 */}
              <div data-aos="fade-up" className="w-full p-3 md:w-4/5 lg:w-2/3">
                <ThreeDCard data-aos="fade-up">
                  <CardSpotlight
                    color="foreground"
                    radius={500}
                    className="size-full cursor-pointer overflow-hidden rounded-xl"
                  >
                    <div className="flex flex-col gap-6 pb-6 md:h-full">
                      <h3 className="text-foreground-900 text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
                        Advanced Analytics Dashboard
                      </h3>
                      <p className="text-foreground-400 text-medium sm:text-lg md:text-xl">
                        Track campaign performance, customer engagement, and ROI
                        with real-time analytics.
                      </p>
                    </div>
                    <Image
                      src="/img/image copy 4.png"
                      alt="Description"
                      className="max-h-72 w-full rounded-2xl object-cover"
                    />
                  </CardSpotlight>
                </ThreeDCard>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
