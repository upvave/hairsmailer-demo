import {
  Badge,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
  User,
} from '@heroui/react';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { LuLogOut, LuUserRound } from 'react-icons/lu';
import { RiLockPasswordLine, RiWifiOffLine } from 'react-icons/ri';

import useAuth from '@/context/auth';
import { useSocket } from '@/context/socket';

import UserProfile from './user-profile';

export default function UserButton() {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  return (
    <Dropdown>
      <Badge
        color={isConnected ? 'success' : 'danger'}
        content={
          isConnected ? (
            ''
          ) : (
            <Tooltip
              content="No Network Connection"
              showArrow
              color="danger"
              placement="bottom-start"
            >
              <RiWifiOffLine />
            </Tooltip>
          )
        }
        placement="top-left"
        shape="rectangle"
        classNames={{
          badge: cn('right-4 top-4', isConnected ? '' : 'w-6'),
        }}
      >
        <DropdownTrigger>
          <User
            avatarProps={{
              size: 'sm',
              src: undefined,
              fallback: (
                <p className="text-lg text-white">{name?.[0] || <FiUser />}</p>
              ),
              classNames: {
                base: 'bg-primary-500',
              },
              className: 'shrink-0',
            }}
            classNames={{
              name: 'text-default-600 line-clamp-1 max-w-32 break-words',
              description: 'text-default-500 line-clamp-1 break-words max-w-32',
            }}
            className="cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            name={user?.name || 'Unname'}
            description={user?.email || ''}
          />
        </DropdownTrigger>
      </Badge>
      <DropdownMenu disabledKeys={['profile']}>
        <DropdownSection>
          <DropdownItem key="profile" className="opacity-100">
            <UserProfile
              email={user?.email || 'user@domain.com'}
              name={user?.name || 'User Name'}
              picture={undefined}
            />
          </DropdownItem>
        </DropdownSection>
        <DropdownSection className="gap-2">
          <DropdownItem
            as={Link}
            href="/profile"
            key="Profile"
            startContent={<LuUserRound />}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            as={Link}
            href="/change-password"
            key="change-password"
            startContent={<RiLockPasswordLine />}
          >
            Change Password
          </DropdownItem>
          <DropdownItem
            key="logout"
            onPress={logout}
            className="text-danger"
            color="danger"
            startContent={<LuLogOut />}
          >
            logout
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
