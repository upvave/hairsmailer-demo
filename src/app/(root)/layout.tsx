import { PropsWithChildren } from 'react';

import Footer from '@/components/home/footer';
import Navbar from '@/components/home/navbar';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
