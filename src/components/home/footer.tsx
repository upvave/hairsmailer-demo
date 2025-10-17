'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import DockApp from '../ui/dock';

const Footer = () => {
  return (
    <footer className="border-foreground-400 w-full px-4 py-12 ">
      <div className="container mx-auto  grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/favicon/favicon-512x512.png"
              alt="logo"
              width="50"
              height="30"
            />
            <h3 className="text-primary-600 text-3xl font-extrabold">
              Hairs Mailer
            </h3>
          </div>
          <p className="text-foreground-900 text-sm leading-relaxed ">
            Innovating for a better tomorrow. We are committed to delivering
            high-quality solutions that empower businesses and individuals.
          </p>
          <div className="flex items-center justify-center space-x-5 pt-2">
            <DockApp />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4 md:items-start">
          <h3 className="text-foreground-900 text-xl font-bold">Quick Links</h3>
          <ul className="flex flex-col items-center space-y-4 md:items-start">
            <li>
              <Link
                href="/"
                className="text-foreground-700 hover:text-primary-600 transition-colors duration-300 "
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/feature"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center space-y-4 md:items-start">
          <h3 className="text-foreground-900 text-xl font-bold">Resources</h3>
          <ul className="flex flex-col items-center space-y-3 md:items-start">
            <li>
              <Link
                href="/support"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-foreground-700   hover:text-primary-600 transition-colors duration-300 "
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center space-y-4 md:items-start">
          <h3 className="text-foreground-900 text-xl font-bold">Contact Us</h3>
          <p className="text-foreground-700  ">
            123 Tech Avenue, Innovation City, 98765
          </p>
          <p className="text-foreground-700  ">Email: info@yourbrand.com</p>
          <p className="text-foreground-700  ">Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      <div className="text-foreground-700 border-foreground-400 mt-10 text-center text-sm ">
        <p>
          &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
        </p>
        <p className="mt-1">
          Designed with <span className="text-red-700">&hearts;</span> by Moaaz
          Mustafa
        </p>
      </div>
    </footer>
  );
};

export default Footer;
