'use client';
import 'aos/dist/aos.css';

import { Chip, Image } from '@heroui/react';
import AOS from 'aos';
import { useEffect } from 'react';

import { CardSpotlight } from '@/components/ui/card-spotlight';

import ThreeDCard from './threed-card';

export default function Offer() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  }, []);
  return (
    <>
      <section className="my-8 flex w-full items-center justify-center">
        <div className="grid  w-full max-w-7xl grid-cols-1 items-start justify-center gap-8 p-6 md:grid-cols-2 md:p-12">
          <div className="flex w-full flex-col items-start md:pr-20">
            <Chip
              data-aos="fade-up"
              color="primary"
              classNames={{
                content:
                  'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text text-medium sm:text-lg md:text-xl font-medium text-transparent',
                base: 'p-4 py-6 bg-primary-900/30',
              }}
            >
              What We Offer
            </Chip>
            <div
              data-aos="fade-up"
              className=" mt-7 flex w-full flex-col items-center gap-7  "
            >
              <h1 className="text-foreground-900 text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                Email Marketing That Drives Results
              </h1>
              <p className="text-foreground-400 text-medium font-normal sm:text-lg md:text-xl">
                From campaign creation to customer engagement, we provide the
                tools to grow your business and maximize conversions.
              </p>
            </div>
            <div
              data-aos="fade-up"
              className="my-2 flex w-full items-center justify-start gap-5 p-3 md:items-start"
            >
              <div className="bg-primary-900/50 ring-foreground-500 drop-shadow-foreground-900/50 w-fit rounded-2xl p-4 ring-1 drop-shadow-2xl ">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 17.1562V14.1562"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14.1562V9.15625"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 9.15625V6.15625"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 10.1562V4.15625"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 3.15625V14.1562C3 17.456 3 19.1059 4.02513 20.1311C5.05025 21.1562 6.70017 21.1562 10 21.1562H21"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-foreground-900 text-medium font-semibold sm:text-lg md:text-xl ">
                  Intelligent Campaign Optimization
                </h2>
                <p className="text-foreground-400 text-medium font-normal sm:text-lg md:text-xl">
                  Use AI to analyze performance and automatically optimize your
                  campaigns for better results.
                </p>
              </div>
            </div>
            <div
              data-aos="fade-up"
              className="my-2 flex w-full items-center justify-start gap-5 p-3 md:items-start"
            >
              <div className="bg-primary-900/50 ring-foreground-500 drop-shadow-foreground-900/50 w-fit rounded-2xl p-4 ring-1 drop-shadow-2xl ">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 17.1562V14.1562"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14.1562V9.15625"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 9.15625V6.15625"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 10.1562V4.15625"
                    stroke="#02931f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 3.15625V14.1562C3 17.456 3 19.1059 4.02513 20.1311C5.05025 21.1562 6.70017 21.1562 10 21.1562H21"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-foreground-900 text-medium font-semibold sm:text-lg md:text-xl ">
                  Automated Customer Engagement
                </h2>
                <p className="text-foreground-400  text-medium font-normal sm:text-lg md:text-xl">
                  Set up auto-replies and smart workflows to engage customers
                  24/7 without manual effort.
                </p>
              </div>
            </div>
          </div>
          <div
            data-aos="fade-up"
            className="flex h-fit w-full flex-col items-start "
          >
            <ThreeDCard>
              <CardSpotlight
                color="foreground"
                radius={500}
                className="w-full cursor-pointer overflow-hidden rounded-xl"
              >
                <Image
                  src="/img/image copy 6.png"
                  className="relative z-10"
                  alt="Image"
                />
              </CardSpotlight>
            </ThreeDCard>
          </div>
        </div>
      </section>
    </>
  );
}
