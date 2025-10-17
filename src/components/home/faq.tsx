'use client';
import 'aos/dist/aos.css';

import { Chip } from '@heroui/react';
import { Accordion, AccordionItem } from '@heroui/react';
import AOS from 'aos';
import { useEffect } from 'react';

export default function Faq() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  }, []);
  interface accorProps {
    title: string;
    description: string;
    isOpen?: boolean;
  }
  const data: accorProps[] = [
    {
      title: 'How does the AI auto-reply system work?',
      description:
        'Our AI analyzes incoming messages and generates contextually relevant responses based on your brand voice and previous interactions. You can customize response templates and set rules for when auto-replies should be triggered.',
      isOpen: true,
    },
    {
      title: 'Can I use the inbox chat feature with multiple team members?',
      description:
        'Yes! Our Professional and Enterprise plans support multiple team members. You can assign conversations, collaborate in real-time, and track team performance through our centralized inbox dashboard.',
    },
    {
      title: 'What email volume limits do you have?',
      description:
        'The Starter plan includes 1,000 emails per month. Professional plan offers unlimited emails. Enterprise plans have custom volume agreements tailored to your needs.',
    },
    {
      title: 'Does the CRM integrate with other tools?',
      description:
        'Absolutely! Our AI CRM system integrates with popular platforms including Zapier, Salesforce, HubSpot, and more. We also offer custom API integration for Enterprise clients.',
    },
    {
      title: 'How secure is my customer data?',
      description:
        'We take security seriously. All data is encrypted in transit and at rest, we comply with GDPR and CCPA regulations, and our infrastructure is regularly audited for security vulnerabilities.',
    },
  ];
  return (
    <>
      <section
        id="faq"
        className="flex w-full items-center justify-center py-8"
      >
        <div className="grid  w-full max-w-7xl grid-cols-1 items-start justify-center gap-8 p-6 md:grid-cols-2 md:p-12">
          <div className="flex w-full flex-col items-start lg:pl-20">
            <Chip
              data-aos="fade-up"
              color="primary"
              classNames={{
                content:
                  'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text sm:text-lg text-medium md:text-xl font-medium text-transparent',
                base: 'p-4 py-6 bg-primary-900/30',
              }}
            >
              FAQ
            </Chip>
            <div
              data-aos="fade-up"
              className=" mt-7 flex w-full flex-col items-center gap-7  "
            >
              <h1 className="text-foreground-900 text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
                Got questions? We&apos;ve got answers.
              </h1>
              <p className="text-foreground-400 text-medium font-normal sm:text-lg md:text-xl">
                Find answers to common questions about our email marketing
                platform, features, and pricing.
              </p>
            </div>
          </div>
          <div data-aos="fade-up">
            <Accordion variant="splitted">
              {data.map((item, i) => (
                <AccordionItem key={i} title={item.title}>
                  {item.description}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
