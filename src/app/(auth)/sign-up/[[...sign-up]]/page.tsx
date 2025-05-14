'use client'

import { SignUp } from '@clerk/nextjs';
import { Loader2Icon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate server check.
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(() => {
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='flex h-screen w-screen justify-center items-center'>
      <div className='animate-spin'>
        <Loader2Icon size={32}/>
      </div>
    </div>
    )
  }

  return (
    <div className='flex h-screen w-screen'>
      <div className='w-1/2 bg-gray-100 dark:bg-gray-800 flex flex-col justify-center items-center p-8'>
        <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4'>
          Welcome User
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
        Sign up to your account to start learning.
        </p>
      </div>
      <div className='w-1/2 bg-white dark:bg-gray-900 flex flex-col justify-center items-center p-8'>
        <div className='w-full max-w-md max-h-lg'>
          <SignUp />
        </div>
      </div>
    </div>
  );
}
