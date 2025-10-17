'use client';

import {
  Button,
  Link,
  Navbar as UiNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

export const AcmeLogo = () => (
  <Image src="/favicon/favicon-512x512.png" alt="logo" width="30" height="30" />
);

interface menuProps {
  title: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname(); // Detect current route
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems: menuProps[] = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Features', href: '/feature' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Integration', href: '/integration' },
  ];

  return (
    <UiNavbar
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      maxWidth="xl"
      className="px-2 md:px-6 "
    >
      <NavbarContent>
        <NavbarBrand>
          <Link href="/" className="flex cursor-pointer items-center gap-2">
            <AcmeLogo />
            <p className="font-bold text-inherit">Hairs Mailer</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              className="hover:text-primary"
              color={pathname === item.href ? 'primary' : 'foreground'}
              href={item.href}
            >
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Side */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/app"
            variant="flat"
            className="hidden sm:flex"
          >
            Get Started
          </Button>
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="flex items-center">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={pathname === item.href ? 'primary' : 'foreground'}
              href={item.href}
              size="lg"
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button as={Link} color="primary" href="/app" variant="flat">
            Get Started
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </UiNavbar>
  );
}
