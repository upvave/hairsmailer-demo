'use client';
import 'aos/dist/aos.css';

import { Chip } from '@heroui/react';
import AOS from 'aos';
import { useEffect } from 'react';

import { HoverEffect } from '../ui/card-hover-effect';

export function CardHoverEffectDemo() {
  return (
    <div className="mx-auto max-w-7xl px-8">
      <HoverEffect items={data} />
    </div>
  );
}
const Svg1 = () => (
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
);
export const data = [
  {
    svg: <Svg1 />,
    title: 'AI-Powered Insights',
    description:
      'Leverage artificial intelligence to understand customer behavior and optimize campaigns.',
  },
  {
    svg: <Svg1 />,
    title: 'Seamless Integration',
    description:
      'Connect with your favorite tools and platforms for a unified workflow.',
  },
  {
    svg: <Svg1 />,
    title: 'Automated Workflows',
    description:
      'Save time with intelligent automation for responses, follow-ups, and customer engagement.',
  },
  {
    svg: <Svg1 />,
    title: 'Inbox Chat Support',
    description:
      'Communicate directly with customers through integrated chat functionality.',
  },
  {
    svg: <Svg1 />,
    title: 'Enterprise-Grade Security',
    description:
      'Protect your data and customer information with advanced security measures.',
  },
  {
    svg: <Svg1 />,
    title: 'Intuitive User Interface',
    description:
      'Manage campaigns effortlessly with our clean and user-friendly dashboard.',
  },
];

export default function Benifits() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  }, []);
  return (
    <>
      <section className=" flex w-full justify-center">
        <div className="flex w-full max-w-7xl flex-col items-center  justify-center gap-5 p-6 py-10 md:p-12">
          <Chip
            data-aos="fade-up"
            color="primary"
            classNames={{
              content:
                'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text sm:text-lg text-medium md:text-xl font-medium text-transparent',
              base: 'p-4 py-6 bg-primary-900/30',
            }}
          >
            Benifits
          </Chip>
          <div
            data-aos="fade-up"
            className="m-10 mt-7 flex w-full flex-col items-center gap-7 lg:w-4/5"
          >
            <h1 className="text-foreground-900 text-center text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
              Why Choose Our Email Marketing Platform
            </h1>
            <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-xl">
              Experience the future of email marketing with AI-driven automation
              and intelligent customer engagement.
            </p>
          </div>
          <CardHoverEffectDemo />
        </div>
      </section>
    </>
  );
}
