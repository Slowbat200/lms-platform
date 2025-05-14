import { ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/mode-toggle';

import { UserButton } from '@clerk/nextjs';

import logo from '../../../public/assets/logo.svg'

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
    <header className='flex h-12 shadow bg-[#F8F9FA] dark:bg-[#101720] z-10'>
      <nav className='flex gap-4 container px-2.5'>
        <div className='mr-auto flex items-center gap-2'>
          <Link className='text-lg hover:underline' href='/admin'>
            <Image src={logo} alt='Logo' width={50} height={50} />
          </Link>
          <Badge>Admin</Badge>
        </div>
        <Link className='hover:bg-white/10 flex items-center px-2' href='/'>
          Home
        </Link>
        <Link
          className='hover:bg-white/10 flex items-center px-2'
          href='/admin/courses'
        >
          Courses
        </Link>
        <Link
          className='hover:bg-white/10 flex items-center px-2'
          href='/admin/products'
        >
          Products
        </Link>
        <Link
          className='hover:bg-white/10 flex items-center px-2'
          href='/admin/sales'
        >
          Sales
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
      </nav>
    </header>
  );
}
