'use client'

import { useRouter } from 'next/navigation'

export default function NotAuthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">

      <div className="bg-white rounded-xl shadow-lg p-6 text-center w-[300px]">

        {/* IMAGE */}
        <img
          src="https://picsum.photos/300/150"
          alt="not authorized"
          className="rounded-md mb-4"
        />

        {/* TEXT */}
        <h2 className="text-red-500 font-semibold text-lg">
          ❌ Anda belum login
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          Silakan login terlebih dahulu
        </p>

        {/* BUTTON */}
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ← Kembali
        </button>

      </div>
    </div>
  )
}