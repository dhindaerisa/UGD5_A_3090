'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '../../components/Game1';

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isLogin = localStorage.getItem('isLogin');

    if (!isLogin) {
      router.replace('/auth/not-authorized');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // ⛔ Jangan render apa-apa sebelum cek login selesai
  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 text-white">
        Selamat Datang!
      </h1>

      <Game1 />
    </div>
  );
}