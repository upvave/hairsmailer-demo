import { BiMessageRoundedDetail } from 'react-icons/bi';
import { CiSettings } from 'react-icons/ci';
import { LiaIdCard } from 'react-icons/lia';
import { MdOutlineViewKanban, MdScreenSearchDesktop } from 'react-icons/md';
import {
  PiGlobe,
  PiHouseLine,
  PiRobot,
  PiShield,
  PiSpeakerHighLight,
  PiUserCircleGear,
  PiUserFocus,
  PiUsersFour,
  PiUsersThree,
} from 'react-icons/pi';

import { Firmen, googleMap, Treatwell } from './icons';

export const meta = {
  url: 'www.hairsmailer.com',
  title: 'Hairs Mailer',
  titleTemplate: 'Hairs Mailer | %s',
  description:
    'Hairs Mailer is a powerful tool designed to help you manage and optimize your hair salon business. From customer management to marketing automation, Hairs Mailer has everything you need to succeed.',
  keywords: [
    'Hairs Mailer',
    'hair salon management',
    'customer management',
    'marketing automation',
    'business optimization',
    'hair salon software',
    'salon management tool',
  ],
};

export const appbar = {
  menu: [
    {
      title: 'Dashboard',
      icon: PiHouseLine,
      url: 'app',
    },
    {
      title: 'Campaigns',
      icon: PiSpeakerHighLight,
      url: 'campaigns',
    },
    {
      title: 'Inbox',
      icon: BiMessageRoundedDetail,
      url: 'inbox',
    },
    {
      title: 'Customer Status',
      icon: MdOutlineViewKanban,
      url: 'customer-status',
    },
    {
      title: 'Audiences',
      icon: PiUsersFour,
      url: 'audiences',
    },
    {
      title: 'Leads',
      icon: PiUserFocus,
      url: 'leads',
    },
    {
      title: 'Senders',
      icon: LiaIdCard,
      url: 'sender',
    },
    {
      title: 'Team',
      icon: PiUsersThree,
      url: 'team',
      submenu: [
        {
          title: 'Users',
          url: 'users',
          icon: PiUserCircleGear,
        },
        {
          title: 'Roles',
          url: 'roles',
          icon: PiShield,
        },
      ],
    },
    {
      title: 'Scraping',
      icon: MdScreenSearchDesktop,
      url: 'scraping',
      submenu: [
        {
          title: 'Google Maps',
          url: 'google-maps',
          icon: googleMap,
        },
        {
          title: 'Firmen',
          url: 'firmen',
          icon: Firmen,
        },
        {
          title: 'Treatwell',
          url: 'treatwell',
          icon: Treatwell,
        },
        {
          title: 'Website',
          url: 'website',
          icon: PiGlobe,
        },
      ],
    },
    {
      title: 'Settings',
      icon: CiSettings,
      url: 'settings',
      submenu: [
        {
          title: 'Ai Settings',
          url: 'ai-settings',
          icon: PiRobot,
        },
      ],
    },
  ],
};
