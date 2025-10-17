'use client';

import AOS from 'aos';
import { useEffect } from 'react';

import NumberTicker from './ticker';

export default function Impact() {
  useEffect(() => {
    AOS.init({
      duration: 400,
      once: false,
    });
  });
  return (
    <section className="flex w-full items-center justify-center py-8">
      <div className="flex w-full max-w-6xl flex-col gap-16 p-6 md:p-12">
        <h3
          data-aos="fade-up"
          className="text-foreground-600 text-medium text-center font-normal sm:text-xl md:text-2xl"
        >
          Our{' '}
          <span className=" text-foreground-900 font-bold">
            Email Marketing Platform
          </span>{' '}
          Impact in Numbers
        </h3>
        <div className="grid grid-cols-1 items-center justify-between sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div
            data-aos="fade-up"
            className="my-2 flex flex-col items-center justify-between gap-4"
          >
            <NumberTicker
              value={95}
              duration={2000}
              className="text-foreground-900 text-3xl font-bold md:text-4xl"
              suffix="%"
              decimalPlaces={0}
            />
            <p className="text-foreground-900 fent-medium text-medium sm:text-lg md:text-xl">
              Email Delivery Rate
            </p>
          </div>
          <div
            data-aos="fade-up"
            className="my-2 flex flex-col items-center justify-between gap-4"
          >
            <NumberTicker
              value={4}
              duration={1500}
              className="text-foreground-900 text-3xl font-bold md:text-4xl"
              suffix="X"
              decimalPlaces={0}
              delay={200}
            />
            <p className="text-foreground-900 fent-medium text-medium sm:text-lg md:text-xl">
              Engagement Increase
            </p>
          </div>
          <div
            data-aos="fade-up"
            className="my-2 flex flex-col items-center justify-between gap-4"
          >
            <NumberTicker
              value={3.5}
              duration={1500}
              className="text-foreground-900 text-3xl font-bold md:text-4xl"
              suffix="H"
              decimalPlaces={1}
              delay={300}
            />
            <p className="text-foreground-900 fent-medium text-medium sm:text-lg md:text-xl">
              Time Saved Daily
            </p>
          </div>
          <div
            data-aos="fade-up"
            className="my-2 flex flex-col items-center justify-between gap-4"
          >
            <NumberTicker
              value={50}
              duration={2000}
              className="text-foreground-900 text-3xl font-bold md:text-4xl"
              suffix="K+"
              decimalPlaces={0}
              delay={200}
            />
            <p className="text-foreground-900 fent-medium text-medium sm:text-lg md:text-xl">
              Active Businesses
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
