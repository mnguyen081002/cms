import Link from 'next/link';

export const DemoBanner = () => (
  <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center text-lg font-semibold text-white [&_a]:text-yellow-300 [&_a:hover]:text-yellow-100">
    Welcome to Our Content Platform -
    {' '}
    <Link href="/auth/register">Start Creating Today</Link>
  </div>
);
