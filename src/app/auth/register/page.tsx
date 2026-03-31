'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const generateCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export default function RegisterPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);

  const [strengthConfirm, setStrengthConfirm] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<RegisterFormData>();

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  useEffect(() => {
    setMounted(true);
    setCaptcha(generateCaptcha());
  }, []);

  useEffect(() => {
    const value = Math.min(
      (password.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(password) ? 25 : 0) +
      (/[0-9]/.test(password) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 25 : 0),
      100
    );
    setStrength(value);
  }, [password]);

  useEffect(() => {
    const value = Math.min(
      (confirmPassword.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(confirmPassword) ? 25 : 0) +
      (/[0-9]/.test(confirmPassword) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(confirmPassword) ? 25 : 0),
      100
    );
    setStrengthConfirm(value);
  }, [confirmPassword]);

  if (!mounted) return null;

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    if (data.captcha !== captcha) {
      toast.error('Captcha salah');
      return;
    }

    toast.success('Register Berhasil!');
    router.push('/auth/login');
  };

  return (
    <AuthFormWrapper title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

        {/* USERNAME */}
        <div className="space-y-2">
          <label>Username (max 8 karakter)</label>
          <input
            placeholder="Masukkan username"
            {...register('username')}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label>Email</label>
          <input
            placeholder="Masukkan email"
            {...register('email')}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* NOMOR TELEPON */}
        <div className="space-y-2">
          <label>Nomor Telepon</label>
          <input
            placeholder="Masukkan nomor telepon"
            {...register('nomorTelp')}
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label>Password</label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              {...register('password')}
              className="w-full px-4 py-2 border rounded pr-10"
            />

            {/* 👁 ICON */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500"
            >
              👁
            </button>
          </div>

          {password.length > 0 && (
            <>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="h-2 bg-red-500 rounded"
                  style={{ width: `${strength}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Strength: {strength}%</p>
            </>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="space-y-2">
          <label>Konfirmasi Password</label>

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Masukkan ulang password"
              {...register('confirmPassword')}
              className="w-full px-4 py-2 border rounded pr-10"
            />

            {/* 👁 ICON */}
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2 text-gray-500"
            >
              👁
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="h-2 bg-red-500 rounded"
                  style={{ width: `${strengthConfirm}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Strength: {strengthConfirm}%
              </p>
            </>
          )}
        </div>

        {/* CAPTCHA */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>Captcha:</span>
            <span className="bg-gray-200 px-2 py-1 rounded font-bold">
              {captcha}
            </span>
          </div>

          <input
            placeholder="Masukkan captcha"
            {...register('captcha')}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>

        <SocialAuth />

        <p className="text-center text-sm">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-blue-600">
            Login
          </Link>
        </p>

      </form>
    </AuthFormWrapper>
  );
}