import { ReactNode, Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';

import { canAccessAdminPages } from '@/permissions/general';

import { getCurrentUser } from '@/services/clerk';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

import logo from '../../../public/assets/logo.svg';

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
        <Navbar />
        {children}
    </>
  );
}

function Navbar() {
  return (
    <header className='flex h-12 dark:shadow-[#fff2] shadow bg-[#F8F9FA] dark:bg-[#101720] z-10'>
      <nav className='flex gap-4 container px-2.5'>
        <Link
          className='mr-auto text-lg hover:underline flex items-center'
          href='/'
        >
          <Image src={logo} alt='Logo' width={50} height={50} />
        </Link>
        <Suspense>
          <SignedIn>
            <AdminLink />
            <Link
              className='hover:bg-white/10 flex items-center px-2'
              href='/courses'
            >
              My Courses
            </Link>
            <Link
              className='hover:bg-white/10 flex items-center px-2'
              href='/purchases'
            >
              Purchase History
            </Link>
            <div className='size-8 self-center'>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: '100%', height: '100%' },
                  },
                }}
              />
            </div>
            <div className='self-center'>
              <ModeToggle />
            </div>
          </SignedIn>
        </Suspense>
        <Suspense>
          <SignedOut>
            <Button className='self-center cursor-pointer' asChild>
              <SignInButton>Sign In</SignInButton>
            </Button>
          </SignedOut>
        </Suspense>
      </nav>
    </header>
  );
}

async function AdminLink() {
  const user = await getCurrentUser({ allData: true });
  console.log(user.user?.name);
  if (!canAccessAdminPages(user)) return null;

  return (
    <Link className='hover:bg-white/10 flex items-center px-2' href='/admin'>
      Admin
    </Link>
  );
}
