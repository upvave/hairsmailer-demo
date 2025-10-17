'use client';

import Benifits from '@/components/home/benifits';
import Faq from '@/components/home/faq';
import Features from '@/components/home/features';
import Goal from '@/components/home/goal';
import Header from '@/components/home/header';
import Integration from '@/components/home/integration';
import Logomarquee from '@/components/home/marquee';
import Offer from '@/components/home/offer';
import Pricing from '@/components/home/pricing';
import Quote from '@/components/home/quote';
import Reviews from '@/components/home/review';
import Services from '@/components/home/services';
import Started from '@/components/home/started';

export default function Page() {
  return (
    <>
      <Header />
      <Logomarquee />
      <Features />
      <Services />
      <Offer />
      <Goal />
      <Quote />
      <Benifits />
      <Integration />
      <Reviews />
      <Pricing />
      <Faq />
      <Started />
    </>
  );
}
