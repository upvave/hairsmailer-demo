'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export default function AboutDetails() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  }, []);
  return (
    <section className="flex w-full items-center justify-center">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-12 p-6 md:grid-cols-2 md:p-12">
        <div data-aos="fade-right">
          <h1 className="text-foreground-900 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl ">
            Transforming how businesses connect with customers.
          </h1>
        </div>
        <div data-aos="fade-left" className="flex flex-col items-start gap-4">
          <p className="text-foreground-700 text-medium text-start font-normal sm:text-lg md:text-xl">
            Email marketing used to be straightforward. Send messages, track
            opens, done. But as businesses grew, managing customer relationships
            became overwhelming. Tools were scattered, engagement dropped, and
            personalization felt impossible at scale.
          </p>
          <p className="text-foreground-700 text-medium text-start font-normal sm:text-lg md:text-xl">
            We built an intelligent platform that combines AI automation with
            powerful campaign management. From inbox chat to auto-replies, from
            smart CRM to real-time analytics—everything works together
            seamlessly to help you engage customers meaningfully.
          </p>
          <p className="text-foreground-700 text-medium text-start font-normal sm:text-lg md:text-xl">
            Today, businesses of all sizes trust our platform to power their
            email marketing. We&apos;re helping teams build authentic customer
            relationships through intelligent automation and data-driven
            insights.
          </p>
        </div>
      </div>
    </section>
  );
}
