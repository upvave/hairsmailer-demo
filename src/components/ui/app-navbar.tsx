'use client';

import { Button, cn } from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoChevronForward } from 'react-icons/io5';

import { appbar } from '@/constants/site-config.text';

import UserButton from './user-button';

export default function AppNavbar() {
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState<string>('app');
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  useEffect(() => {
    const path = pathname.split('/')[1];
    setCurrentTab(path || 'app');

    // Auto-expand menus if any submenu item is active
    const newExpandedMenus = new Set(expandedMenus);
    appbar.menu.forEach((tab) => {
      if (tab.submenu && tab.submenu.length > 0) {
        const hasActiveSubmenu = tab.submenu.some((subItem) =>
          pathname.includes(subItem.url),
        );
        if (hasActiveSubmenu) {
          newExpandedMenus.add(tab.url);
        }
      }
    });
    setExpandedMenus(newExpandedMenus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSubmenu = (menuUrl: string) => {
    const newExpandedMenus = new Set(expandedMenus);
    if (newExpandedMenus.has(menuUrl)) {
      newExpandedMenus.delete(menuUrl);
    } else {
      newExpandedMenus.add(menuUrl);
    }
    setExpandedMenus(newExpandedMenus);
  };

  return (
    <nav className="flex w-full max-w-56 shrink-0 flex-col items-center justify-between border-r border-gray-200 py-4 pl-1 pr-0">
      <Link href="/app" className="flex items-center justify-center gap-3 pr-4">
        <Image
          src="/hairsmailer.png"
          alt="hairsmailer"
          width={40}
          height={40}
        />
        <h1 className="text-primary text-2xl font-medium">Hairs Mailer</h1>
      </Link>
      <div className="mt-4 flex w-full flex-col gap-2 overflow-scroll py-1 pr-3">
        {appbar.menu.map((tab) => {
          const isActive = currentTab === tab.url;
          const hasSubmenu = tab.submenu && tab.submenu.length > 0;
          const isExpanded = expandedMenus.has(tab.url);

          return (
            <div key={tab.url} className="w-full">
              <Button
                as={hasSubmenu ? undefined : Link}
                href={hasSubmenu ? undefined : `/${tab.url}`}
                onPress={hasSubmenu ? () => toggleSubmenu(tab.url) : undefined}
                variant={isActive ? 'solid' : 'light'}
                color={isActive ? 'primary' : 'default'}
                radius="sm"
                className={cn(
                  'text-small flex h-auto w-full items-center justify-start px-5 py-2 text-left transition duration-200',
                  !isActive && 'text-default-500',
                  isExpanded && 'text-primary bg-primary-50/30',
                )}
                startContent={
                  <span className="w-4 text-xl">
                    {tab.icon && <tab.icon />}
                  </span>
                }
                endContent={
                  hasSubmenu ? (
                    <span className="flex flex-1 justify-end">
                      <IoChevronForward
                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </span>
                  ) : null
                }
              >
                <span className="">{tab.title}</span>
              </Button>

              {/* Submenu */}
              {hasSubmenu && isExpanded && (
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  {tab.submenu!.map((subItem) => {
                    const subIsActive = pathname.includes(subItem.url);
                    return (
                      <Button
                        key={subItem.url}
                        as={Link}
                        href={`/${subItem.url}`}
                        variant={subIsActive ? 'solid' : 'light'}
                        color={subIsActive ? 'primary' : 'default'}
                        radius="sm"
                        size="sm"
                        className={cn(
                          'text-small flex h-auto w-full items-center justify-start px-4 py-1.5 text-left transition duration-200',
                          !subIsActive && 'text-default-500',
                        )}
                        startContent={
                          <span className="w-4 text-base">
                            {subItem.icon && <subItem.icon />}
                          </span>
                        }
                      >
                        <span className="text-sm">{subItem.title}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex-1" />
      <UserButton />
    </nav>
  );
}
