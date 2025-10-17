'use client';
import 'aos/dist/aos.css';

import { Chip } from '@heroui/react';
import AOS from 'aos';
import { ReactElement, useEffect } from 'react';

export default function Services() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
    });
  }, []);
  const Svg1 = () => (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 17.1562V14.1562"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.1562V9.15625"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.15625V6.15625"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 10.1562V4.15625"
        stroke="#8B5CF6"
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
  const Svg2 = () => (
    <svg
      width="25"
      height="25"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3332 26.2253C8.30485 26.2253 5.7907 26.2253 4.2286 24.6631C2.6665 23.1011 2.6665 20.5869 2.6665 15.5586V14.2253C2.6665 9.19694 2.6665 6.68279 4.2286 5.12069C5.7907 3.55859 8.30485 3.55859 13.3332 3.55859H17.9998C22.3832 3.55859 24.5748 3.55859 26.05 4.76921C26.32 4.99083 26.5676 5.23845 26.7892 5.5085C27.9998 6.98363 27.9998 9.17529 27.9998 13.5586"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.6665 11.5586H27.9998"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.3335 7.55859H7.3468M12.6535 7.55859H12.6668"
        stroke="white"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5623 28.8945H17.3335V26.6657C17.3335 25.9585 17.6144 25.2802 18.1146 24.7801L25.4156 17.4802C26.1967 16.6993 27.4631 16.6993 28.2442 17.4802L28.749 17.9852C29.53 18.7662 29.53 20.0326 28.749 20.8136L21.4479 28.1134C20.9478 28.6136 20.2695 28.8945 19.5623 28.8945Z"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
  const Svg3 = () => (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.52992 14.9258C2.31727 16.3198 3.268 17.2874 4.43205 17.7696C8.89481 19.6184 15.1052 19.6184 19.5679 17.7696C20.732 17.2874 21.6827 16.3198 21.4701 14.9258C21.3394 14.0691 20.6932 13.3558 20.2144 12.6592C19.5873 11.7356 19.525 10.728 19.5249 9.65625C19.5249 5.51411 16.1559 2.15625 12 2.15625C7.84413 2.15625 4.47513 5.51411 4.47513 9.65625C4.47503 10.728 4.41272 11.7356 3.78561 12.6592C3.30684 13.3558 2.66061 14.0691 2.52992 14.9258Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 19.1562C8.45849 20.8815 10.0755 22.1562 12 22.1562C13.9245 22.1562 15.5415 20.8815 16 19.1562"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 1.15625C20.105 1.15625 21 2.05125 21 3.15625C21 4.26125 20.105 5.15625 19 5.15625C17.895 5.15625 17 4.26125 17 3.15625C17 2.05125 17.895 1.15625 19 1.15625Z"
        fill="#8B5CF6"
      />
    </svg>
  );
  const Svg4 = () => (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 17.1562V14.1562"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.1562V9.15625"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.15625V6.15625"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 10.1562V4.15625"
        stroke="#8B5CF6"
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
  interface cardProps {
    title: string;
    des: string;
    svg: ReactElement;
  }

  const data: cardProps[] = [
    {
      title: 'AI CRM System',
      des: 'Manage customer relationships with intelligent insights and automated workflows.',
      svg: <Svg1 />,
    },
    {
      title: 'Smart Contact Management',
      des: 'Organize and segment your audience for targeted email campaigns.',
      svg: <Svg2 />,
    },
    {
      title: 'Real-Time Notifications',
      des: 'Stay informed with instant alerts for campaign responses and customer interactions.',
      svg: <Svg3 />,
    },
    {
      title: 'Campaign Analytics',
      des: 'Track performance metrics and optimize your email marketing strategy.',
      svg: <Svg4 />,
    },
  ];
  return (
    <>
      <section className="my-5 flex w-full justify-center">
        <div className="mt-20 flex w-full max-w-7xl flex-col  items-center justify-center gap-5 p-6 md:p-12">
          <Chip
            data-aos="fade-up"
            color="primary"
            classNames={{
              content:
                'from-primary-600 to-foreground-900 text-nowrap bg-gradient-to-r bg-clip-text sm:text-lg text-medium md:text-xl font-medium text-transparent',
              base: 'p-4 py-6 bg-primary-500/30',
            }}
          >
            Services
          </Chip>
          <div
            data-aos="fade-up"
            className="m-10 mt-7 flex w-full flex-col items-center gap-7"
          >
            <h1 className="text-foreground-900 text-center text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
              Complete Email Marketing Platform
            </h1>
            <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-xl">
              All the tools you need to build, automate, and scale your email
              marketing campaigns.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 flex-wrap justify-center py-3 sm:grid-cols-2 md:grid-cols-4 md:py-10">
            {data.map((item, i) => (
              <div
                key={i}
                data-aos="fade-up"
                className=" my-3 flex w-full flex-col items-center gap-5 p-3 md:my-8 md:items-start"
              >
                <div className="bg-primary-500/50 ring-foreground-500 drop-shadow-foreground-900/50 w-fit rounded-2xl p-4 ring-1 drop-shadow-2xl ">
                  {item.svg}
                </div>
                <h2 className="text-foreground-900 text-medium text-center font-semibold sm:text-lg md:text-start md:text-xl">
                  {item.title}
                </h2>
                <p className="text-foreground-400 text-medium text-center font-normal sm:text-lg md:text-start md:text-xl">
                  {item.des}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
