import { AnimatePresence, motion } from 'motion/react';
import { ReactElement, useState } from 'react';

import { cn } from '@/lib/utils';

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    svg: ReactElement;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        'grid w-full max-w-7xl grid-cols-1 py-10  md:grid-cols-2  lg:grid-cols-3',
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.title}
          className="group relative  block size-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="bg-primary-600/50 absolute inset-0 block size-full rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardSvg>{item.svg}</CardSvg>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      data-aos="fade-up"
      className={cn(
        'bg-background group-hover:border-foreground-500 border-foreground-500/30 relative z-20 size-full overflow-hidden rounded-2xl border p-4 ',
        className,
      )}
    >
      <div className="relative z-50">
        <div className="flex flex-col items-center justify-center gap-3 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        'text-foreground-900 text-medium text-center font-semibold sm:text-lg md:text-xl ',
        className,
      )}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        'text-foreground-400 sm:text-medium text-center text-sm font-light md:text-lg',
        className,
      )}
    >
      {children}
    </p>
  );
};

export const CardSvg = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <span
      className={cn(
        'bg-primary-900/50 ring-foreground-500 drop-shadow-foreground-900/50 w-fit rounded-2xl p-4 ring-1 drop-shadow-2xl ',
        className,
      )}
    >
      {children}
    </span>
  );
};
