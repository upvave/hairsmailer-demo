'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export default function MissionAndVision() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  }, []);
  return (
    <section className="flex w-full flex-col items-center justify-center gap-12 p-6 md:p-12">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-12 md:grid-cols-2">
        <div
          data-aos="fade-right"
          className="my-8 flex flex-col items-start gap-8"
        >
          <h1 className="text-foreground-900 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl ">
            Our Mission
          </h1>
          <p className="text-foreground-700 text-medium text-start font-normal sm:text-lg md:text-xl">
            To empower businesses with intelligent email marketing solutions
            that drive meaningful customer connections.
          </p>
        </div>
        <div data-aos="fade-left" className="flex flex-col items-start gap-4">
          <p className="text-foreground-700 text-medium text-start font-normal sm:text-lg md:text-xl">
            &quot;Our mission is to revolutionize email marketing through
            AI-powered automation and intelligent customer engagement. We
            believe every business deserves access to enterprise-level marketing
            tools that are simple to use yet powerful enough to scale. By
            combining smart campaign builders, inbox chat, auto-reply systems,
            and comprehensive CRM capabilities, we help businesses of all sizes
            build authentic relationships with their customers. We&apos;re
            committed to continuous innovation, ensuring our platform adapts to
            the evolving needs of modern marketing while maintaining the human
            touch that makes customer relationships meaningful.&quot;
          </p>
        </div>
      </div>
      <hr className="border-foreground-300 inline-flex w-11/12 items-start justify-center border-t-2" />
      <div className="grid w-full max-w-7xl grid-cols-1 gap-12 p-6 md:grid-cols-2 md:p-12">
        <div
          data-aos="fade-right"
          className="my-8 flex flex-col items-start gap-8"
        >
          <h1 className="text-foreground-900 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl ">
            Our Vision
          </h1>
          <p className="text-foreground-700 text-medium text-start font-normal sm:text-lg md:text-xl">
            To be the world&apos;s most trusted AI-powered email marketing
            platform.
          </p>
        </div>
        <div data-aos="fade-left" className="flex flex-col items-start gap-4">
          <p className="text-foreground-700 text-medium text-start font-normal sm:text-lg md:text-xl">
            &quot;We envision a future where every business can leverage the
            power of artificial intelligence to create personalized, meaningful
            customer experiences at scale. Our goal is to become the go-to
            platform that seamlessly integrates campaign management, customer
            communication, and intelligent automation. We&apos;re building a
            world where marketers can focus on strategy and creativity while AI
            handles the complexity of personalization, timing, and engagement
            optimization. Through continuous innovation in inbox chat,
            auto-reply systems, and predictive analytics, we aim to transform
            how businesses connect with their audiences—making every interaction
            count and every campaign more successful.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
