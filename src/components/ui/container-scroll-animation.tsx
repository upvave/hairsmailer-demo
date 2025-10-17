'use client';
import { motion, MotionValue, useScroll, useTransform } from 'motion/react';
import React, { useRef } from 'react';

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  // const [isMobile, setIsMobile] = React.useState(false);

  // React.useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth <= 768);
  //   };
  //   checkMobile();
  //   window.addEventListener('resize', checkMobile);
  //   return () => {
  //     window.removeEventListener('resize', checkMobile);
  //   };
  // }, []);

  const scaleDimensions = () => {
    return [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="relative flex h-auto items-center justify-center "
      ref={containerRef}
    >
      <div
        className="relative w-full "
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div my-20 flex max-w-7xl flex-col items-center justify-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #5c37a04d,0 9px 20px #5c37a04a,0 37px 37px #5c37a042,0 84px 50px #5c37a026,0 149px 60px #5c37a00a,0 233px 65px #5c37a003',
      }}
      className="border-1 border-foreground-400 shadow-primary-500 flex size-full max-w-full flex-col items-center justify-center rounded-3xl shadow-2xl"
    >
      <div className=" size-full min-w-full overflow-hidden rounded-2xl md:rounded-2xl ">
        {children}
      </div>
    </motion.div>
  );
};
