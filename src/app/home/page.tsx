'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '../../components/Game1'; // ✅ FIX

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLogin = localStorage.getItem('isLogin');

    if (!isLogin) {
      router.push('/auth/not-authorized');
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  return (
    <div>
      <Game1 /> {/* ✅ FIX */}
    </div>
  );
}