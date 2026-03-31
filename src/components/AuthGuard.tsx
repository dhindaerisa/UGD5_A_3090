'use client';
console.log('AUTH GUARD JALAN');
import { useRouter } from 'next/navigation';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // 🔥 CEK LANGSUNG SAAT RENDER
  if (typeof window !== 'undefined') {
    const isLogin = localStorage.getItem('isLogin');

    if (!isLogin) {
      router.replace('/auth/not-authorized');
      return null;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;