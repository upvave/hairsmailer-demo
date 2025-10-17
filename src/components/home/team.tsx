'use client';

import { Card, CardHeader, Chip, Image } from '@heroui/react';
import AOS from 'aos';
import { useEffect } from 'react';

export default function Team() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  });
  interface cardProps {
    name: string;
    position: string;
    imagePath?: string;
    imageAlt?: string;
  }

  const data: cardProps[] = [
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/6797889590f3cb9dcb47a82b_Container (3).png',
      imageAlt: 'Team Member',
    },
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/6797887b47860fca5edff251_Container (4).png',
      imageAlt: 'Team Member',
    },
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/6797889cb27439aa15df73eb_Container.png',
      imageAlt: 'Team Member',
    },
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/67978877bf99b658e6e971c5_Container (5).png',
      imageAlt: 'Team Member',
    },
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/6797870922e054eda4c13c53_Container (7).png',
      imageAlt: 'Team Member',
    },
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/6797889590f3cb9dcb47a82b_Container (3).png',
      imageAlt: 'Team Member',
    },
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/6797889999cf3b77c549ca9c_Container (1).png',
      imageAlt: 'Team Member',
    },
    {
      name: 'Aalay Roussow',
      position: 'Fonder & CEO',
      imagePath: '/img/67978876764f701d889c5526_Container (6).png',
      imageAlt: 'Team Member',
    },
  ];
  return (
    <section className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-7 p-6 md:p-12">
        <Chip
          data-aos="fade-up"
          color="primary"
          classNames={{
            content:
              'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text text-xl font-medium text-transparent',
            base: 'p-4 py-6 bg-primary-900/30',
          }}
        >
          Team
        </Chip>
        <div
          data-aos="fade-up"
          className=" mt-7 flex w-full flex-col items-center gap-7  "
        >
          <h1 className="text-foreground-900 text-center text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
            The Experts Behind Trustara
          </h1>
          <p className="text-foreground-400 text-center text-xl font-normal">
            We&apos;re deeply focused on transforming your business through
            innovation.
          </p>
        </div>
        <div className="grid grid-cols-1 items-center justify-between gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item, i) => (
            <div key={i} data-aos="zoom-in">
              <Card className=" h-[300px] ">
                <CardHeader className="items-start! bg-primary-500/20 absolute bottom-0 z-10 flex-col backdrop-blur-sm">
                  <h4 className="text-large text-foreground-900 font-bold">
                    {item.name}
                  </h4>
                  <p className="text-tiny text-foreground/60 font-medium uppercase">
                    {item.position}
                  </p>
                </CardHeader>
                <Image
                  removeWrapper
                  alt={item.imageAlt}
                  className="z-0 size-full object-cover"
                  src={item.imagePath}
                />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
