'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { generateRandomNickName } from '@/lib/nickname'; 

export default function DashboardPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
        <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6'>
            <h1 className='text-3xl font-bold mb-4'>🔥Welcome to TaskPilot🔥</h1>
            <p className='text-gray-700 mb-2'>Login As Anonymous</p>
            <p className='text-sm text-gray-500 break-all'>User: <span className='font-mono'>{uid}</span></p>
            
            <div className='mt-8 border-t pt-4 text-gray-400 italic'>
                You dont have any tasks yet, Click to begin!
            </div>
        </div>
    </main>
  );
}
