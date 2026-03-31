'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '../../components/Game1';

export default function HomePage() {
  const router = useRouter();

  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isLogin = localStorage.getItem('isLogin');

    if (isLogin) {
      setIsAllowed(true);
    } else {
      router.replace('/auth/not-authorized'); // 🔥 penting pakai replace
    }

    setChecked(true);
  }, []);

  // ⛔ tahan semua render sebelum dicek
  if (!checked) return null;

  // ⛔ kalau tidak login, jangan render apapun
  if (!isAllowed) return null;

  return (
    <div>
      <Game1 />
    </div>
  );
}