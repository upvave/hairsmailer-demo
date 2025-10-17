'use client';

import AboutDetails from '@/components/home/about-details';
import AboutHero from '@/components/home/about-hero';
import Impact from '@/components/home/impact';
import MissionAndVision from '@/components/home/mission&vision';
import Started from '@/components/home/started';
import Team from '@/components/home/team';

export default function Page() {
  return (
    <>
      <AboutHero />
      <AboutDetails />
      <Impact />
      <MissionAndVision />
      <Team />
      <Started />
    </>
  );
}
