import { User } from '@heroui/react';
import { FiUser } from 'react-icons/fi';

export default function UserProfile({
  name,
  email,
  picture,
}: {
  name?: string;
  email?: string;
  picture?: string;
}) {
  return (
    <User
      avatarProps={{
        size: 'sm',
        src: picture || '',
        fallback: (
          <p className="text-lg text-white">{name?.[0] || <FiUser />}</p>
        ),
        classNames: {
          base: 'bg-primary-500',
        },
      }}
      classNames={{
        name: 'text-default-600',
        description: 'text-default-500',
      }}
      name={name || 'Unname'}
      description={email || ''}
    />
  );
}
