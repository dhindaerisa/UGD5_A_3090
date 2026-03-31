'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const generateCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export default function LoginPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [attempt, setAttempt] = useState(3);
  const [captcha, setCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<ErrorObject>({});

  useEffect(() => {
    setMounted(true);
    setCaptcha(generateCaptcha());
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (attempt === 0) {
      toast.error('Kesempatan login habis!');
      return;
    }

    const newErrors: ErrorObject = {};

    // EMAIL
    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (formData.email !== '241713090@gmail.com') {
      newErrors.email =
        'Email harus sesuai dengan NPM kalian (cth. 241713090@gmail.com)';
    }

    // PASSWORD
    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password !== '241713090') {
      newErrors.password =
        'Password harus sesuai dengan NPM kalian (cth. 241713090)';
    }

    // CAPTCHA
    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = 'Captcha salah';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const newAttempt = Math.max(attempt - 1, 0);
      setAttempt(newAttempt);

      setCaptcha(generateCaptcha());

      toast.error(`Login Gagal! Sisa kesempatan: ${newAttempt}`);
      return;
    }

    toast.success('Login Berhasil!');

    // 🔥 AUTH GUARD FIX
    document.cookie = "auth=true; path=/";

    router.push('/home');
  };

  const handleReset = () => {
    setAttempt(3);
    setCaptcha(generateCaptcha());
    toast.success('Kesempatan direset!');
  };

  return (
    <AuthFormWrapper title="Login">
      <form onSubmit={handleSubmit} className="space-y-5 w-full">

        <p className="text-center font-semibold text-gray-600">
          Sisa Kesempatan: {attempt}
        </p>

        {/* EMAIL */}
        <div className="space-y-2">
          <label>Email</label>
          <input
            name="email"
            type="text"
            placeholder="Masukan email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-2 border-red-500' : 'border border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm italic">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label>Password</label>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukan password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded ${
                errors.password ? 'border-2 border-red-500' : 'border border-gray-300'
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500"
            >
              {showPassword ? '👁' : '👁'}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm italic">{errors.password}</p>
          )}
        </div>

        {/* INGAT SAYA + FORGOT */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              onChange={handleChange}
            />
            Ingat Saya
          </label>

          <span className="text-blue-600 cursor-pointer">
            Forgot Password?
          </span>
        </div>

        {/* CAPTCHA */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>Captcha:</span>
            <span className="bg-gray-200 px-2 py-1 rounded font-bold">
              {captcha}
            </span>
            <button type="button" onClick={() => setCaptcha(generateCaptcha())}>
              🔄
            </button>
          </div>

          <input
            name="captchaInput"
            placeholder="Masukan captcha"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded ${
              errors.captcha ? 'border-2 border-red-500' : 'border border-gray-300'
            }`}
          />
          {errors.captcha && (
            <p className="text-red-500 text-sm italic">{errors.captcha}</p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={attempt === 0}
          className={`w-full py-2 rounded text-white ${
            attempt === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={attempt !== 0}
          className={`w-full py-2 rounded text-white ${
            attempt === 0
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="text-center text-sm">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600">
            Daftar
          </Link>
        </p>

      </form>
    </AuthFormWrapper>
  );
}