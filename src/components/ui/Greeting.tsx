'use client';

import useAuth from '@/context/auth';

export default function Greeting() {
  const { user } = useAuth();
  const greeting = () => {
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12 && currentHour >= 4) {
      greeting = 'Good Morning';
    } else if (currentHour < 18) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    return greeting;
  };
  return (
    <h1 className="text-primary text-2xl">
      {greeting()}, {user?.name}.
    </h1>
  );
}
